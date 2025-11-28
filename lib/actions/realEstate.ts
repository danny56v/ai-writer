"use server";

import OpenAI from "openai";
import { ObjectId } from "mongodb";
import { Buffer } from "node:buffer";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getUserPlan } from "@/lib/billing";
import type { PlanKey } from "@/lib/plans";
import { extractStructuredOutput, saveRealEstateGeneration } from "@/lib/realEstateHistory";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const STREET_VIEW_BASE_URL = "https://maps.googleapis.com/maps/api/streetview";
const STREET_VIEW_API_KEY = process.env.GOOGLE_STREET_VIEW_API_KEY ?? process.env.GOOGLE_MAPS_API_KEY;
const STREET_VIEW_IMAGE_SIZE = "640x640";

async function fetchStreetViewImage(location: string) {
  if (!STREET_VIEW_API_KEY) {
    console.warn("[real-estate] Street View API key missing. Falling back to address-only generation.");
    return null;
  }

  try {
    const params = new URLSearchParams({
      size: STREET_VIEW_IMAGE_SIZE,
      location,
      source: "outdoor",
      pitch: "0",
      fov: "85",
      return_error_code: "true",
      key: STREET_VIEW_API_KEY,
    });

    const response = await fetch(`${STREET_VIEW_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      if (response.status === 404) {
        console.warn("[real-estate] Street View image not found for location:", location);
        return null;
      }
      console.error("[real-estate] Street View request failed", response.status, await response.text());
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    if (!arrayBuffer.byteLength) {
      console.warn("[real-estate] Street View returned empty payload for location:", location);
      return null;
    }

    const contentType = response.headers.get("content-type") ?? "image/jpeg";
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    console.error("[real-estate] Street View request errored", error);
    return null;
  }
}

type ListingMetadata = {
  propertyType?: string;
  listingType?: string;
  bedrooms?: string;
  bathrooms?: string;
  language?: string;
  amenities?: string[];
};

function stripMetadataBlock(text: string) {
  const metadataRegex = /<metadata>([\s\S]*?)<\/metadata>/i;
  const match = text.match(metadataRegex);
  if (!match) {
    return { cleanedText: text.trim(), metadata: {} as ListingMetadata };
  }

  let metadata: ListingMetadata = {};
  try {
    metadata = JSON.parse(match[1].trim());
  } catch (error) {
    console.error("Failed to parse metadata block", error);
  }

  const [fullMatch] = match;
  const startIndex = match.index ?? 0;
  const before = text.slice(0, startIndex).trimEnd();
  const after = text.slice(startIndex + fullMatch.length).trimStart();
  const cleanedText = [before, after].filter(Boolean).join("\n\n").trim();

  return { cleanedText: cleanedText || text.trim(), metadata };
}

export type RealEstateDescriptionState = {
  text: string;
  title?: string | null;
  hashtags?: string[];
  historyId?: string;
  streetViewImage?: string | null;
  error?: string;
  usage?: {
    limit: number | null;
    remaining: number | null;
    used: number | null;
  };
};

const REAL_ESTATE_LIMITS: Record<PlanKey, number | null> = {
  free: 1,
  pro_monthly: 50,
  pro_yearly: 50,
  unlimited_monthly: 1500,
  unlimited_yearly: 1500,
};

function daysInUtcMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

function clampAnchorDay(anchorDay: number, year: number, month: number) {
  const days = daysInUtcMonth(year, month);
  return Math.min(Math.max(anchorDay, 1), days);
}

function computeMonthlyPeriodStart(anchorDay: number, reference: Date) {
  const year = reference.getUTCFullYear();
  const month = reference.getUTCMonth();
  const dayInCurrent = clampAnchorDay(anchorDay, year, month);
  let start = new Date(Date.UTC(year, month, dayInCurrent));

  if (reference < start) {
    const prevMonth = month - 1;
    const prevYear = prevMonth < 0 ? year - 1 : year;
    const normalizedPrevMonth = (prevMonth + 12) % 12;
    const dayInPrev = clampAnchorDay(anchorDay, prevYear, normalizedPrevMonth);
    start = new Date(Date.UTC(prevYear, normalizedPrevMonth, dayInPrev));
  }

  return start;
}

function computeMonthlyPeriodKey(planType: PlanKey, anchorDay: number, reference: Date) {
  const periodStart = computeMonthlyPeriodStart(anchorDay, reference);
  return `${planType}-${periodStart.toISOString().slice(0, 10)}`;
}

function getPlanPeriodKey(planType: PlanKey, currentPeriodEnd: Date | null) {
  if (REAL_ESTATE_LIMITS[planType] === null) {
    return `${planType}-unlimited`;
  }

  if (planType === "unlimited_monthly" || planType === "unlimited_yearly") {
    const anchorSource = currentPeriodEnd ? new Date(currentPeriodEnd) : new Date();
    const anchorDay = Number.isNaN(anchorSource.getTime()) ? 1 : anchorSource.getUTCDate();
    return computeMonthlyPeriodKey(planType, anchorDay, new Date());
  }

  if (planType === "free") {
    const now = new Date();
    const month = String(now.getUTCMonth() + 1).padStart(2, "0");
    return `${planType}-${now.getUTCFullYear()}-${month}`;
  }

  if (currentPeriodEnd) {
    const end = currentPeriodEnd instanceof Date ? currentPeriodEnd : new Date(currentPeriodEnd);
    if (!Number.isNaN(end.getTime())) {
      return `${planType}-${end.toISOString()}`;
    }
  }

  const now = new Date();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `${planType}-${now.getUTCFullYear()}-${month}`;
}

async function consumeRealEstateQuota(userId: string, planType: PlanKey, currentPeriodEnd: Date | null) {
  const limit = REAL_ESTATE_LIMITS[planType] ?? REAL_ESTATE_LIMITS.free;
  const periodKey = getPlanPeriodKey(planType, currentPeriodEnd);
  const database = await db();
  const users = database.collection("users");
  const userObjectId = new ObjectId(userId);
  const now = new Date();

  if (limit === null) {
    await users.updateOne(
      { _id: userObjectId },
      {
        $set: {
          "usage.realEstate": {
            planType,
            limit: null,
            used: null,
            periodKey,
            updatedAt: now,
          },
        },
      }
    );
    return { ok: true as const, limit: null, remaining: null };
  }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const current = await users.findOne<{
      usage?: { realEstate?: { planType?: string; used?: number; periodKey?: string } };
    }>({ _id: userObjectId }, { projection: { "usage.realEstate": 1 } });

    const usage = current?.usage?.realEstate;
    const samePlan = usage?.planType === planType;
    const samePeriod = usage?.periodKey === periodKey;

    console.log("[real-estate] consume", {
      userId,
      planType,
      periodKey,
      limit,
      attempt,
      usage,
    });

    if (!samePlan || !samePeriod || typeof usage?.used !== "number") {
      const initialUsed = 1;
      await users.updateOne(
        { _id: userObjectId },
        {
          $set: {
            "usage.realEstate": {
              planType,
              limit,
              used: initialUsed,
              periodKey,
              updatedAt: now,
            },
          },
        }
      );
      return { ok: true as const, limit, remaining: Math.max(limit - initialUsed, 0) };
    }

    if (usage.used >= limit) {
      return {
        ok: false as const,
        error: `You have used all ${limit} generations included in your plan for this period. Update your plan to unlock more generations or wait for the next cycle.`,
      };
    }

    const nextUsed = usage.used + 1;
    const updated = await users.findOneAndUpdate(
      {
        _id: userObjectId,
        "usage.realEstate.planType": planType,
        "usage.realEstate.periodKey": periodKey,
        "usage.realEstate.used": usage.used,
      },
      {
        $set: {
          "usage.realEstate": {
            planType,
            limit,
            used: nextUsed,
            periodKey,
            updatedAt: now,
          },
        },
      },
      { returnDocument: "after" }
    );

    if (updated) {
      console.log("[real-estate] consume -> ok", {
        userId,
        planType,
        periodKey,
        limit,
        usedBefore: usage.used,
        usedAfter: nextUsed,
      });
      return { ok: true as const, limit, remaining: Math.max(limit - nextUsed, 0) };
    }
  }

  return {
    ok: false as const,
    error: "We couldn’t reserve a generation right now. Please try again.",
  };
}

async function restoreRealEstateQuota(userId: string, planType: PlanKey, currentPeriodEnd: Date | null) {
  const limit = REAL_ESTATE_LIMITS[planType] ?? REAL_ESTATE_LIMITS.free;
  if (limit === null) return;

  const periodKey = getPlanPeriodKey(planType, currentPeriodEnd);
  const database = await db();
  const users = database.collection("users");
  const userObjectId = new ObjectId(userId);
  const now = new Date();

  const current = await users.findOne<{
    usage?: { realEstate?: { used?: number; planType?: string; periodKey?: string; limit?: number } };
  }>({ _id: userObjectId }, { projection: { "usage.realEstate": 1 } });

  const usage = current?.usage?.realEstate;
  const samePlan = usage?.planType === planType;
  const samePeriod = usage?.periodKey === periodKey;

  console.log("[real-estate] restore", {
    userId,
    planType,
    periodKey,
    limit,
    usage,
  });

  if (!samePlan || !samePeriod || typeof usage?.used !== "number") {
    await users.updateOne(
      { _id: userObjectId },
      {
        $set: {
          "usage.realEstate": {
            planType,
            limit,
            used: 0,
            periodKey,
            updatedAt: now,
          },
        },
      }
    );
    return;
  }

  const restored = Math.max(usage.used - 1, 0);

  await users.updateOne(
    { _id: userObjectId },
    {
      $set: {
        "usage.realEstate": {
          planType,
          limit,
          used: restored,
          periodKey,
          updatedAt: now,
        },
      },
    }
  );
}

export async function genererateRealEstateDescription(
  _prev: RealEstateDescriptionState,
  formData: FormData
): Promise<RealEstateDescriptionState> {
  const propertyType = ((formData.get("propertyType") as string) || "").trim();
  const location = ((formData.get("location") as string) || "").trim();
  const priceRaw = formData.get("price");
  const listingTypeInput = ((formData.get("listingType") as string) || "sale").toLowerCase();
  const listingType: "sale" | "rent" = listingTypeInput === "rent" ? "rent" : "sale";
  const bedroomsStr = ((formData.get("bedrooms") as string) || "").trim();
  const bathroomsStr = ((formData.get("bathrooms") as string) || "").trim();
  const areaRaw = formData.get("area");
  const lotRaw = formData.get("lot");
  const yearRaw = formData.get("year");
  const description = ((formData.get("description") as string) || "").trim();
  const name = (formData.get("name") as string) || "";
  const email = (formData.get("email") as string) || "";
  const phone = (formData.get("phone") as string) || "";
  const languageRaw = (formData.get("language") as string) || "English";
  const language = languageRaw.trim() || "English";
  const toneRaw = (formData.get("tone") as string) || "Professional & confident";
  const tone = toneRaw.trim() || "Professional & confident";
  const amenitiesSelected = formData
    .getAll("amenities")
    .map(String)
    .map((amenity) => amenity.trim())
    .filter(Boolean);

  if (!location) {
    return { text: "", error: "Please provide a property address." };
  }

  const agentContact = [name, email, phone].filter(Boolean).join(" • ");

  const hasPrice = typeof priceRaw === "string" && priceRaw.trim().length > 0;
  const price = hasPrice ? Number(priceRaw) : undefined;
  if (hasPrice && (!Number.isFinite(price) || (price ?? 0) <= 0)) {
    return { text: "", error: "Price must be a positive number when provided." };
  }

  const hasArea = typeof areaRaw === "string" && areaRaw.trim().length > 0;
  const area = hasArea ? Number(areaRaw) : undefined;
  if (hasArea && (!Number.isFinite(area) || (area ?? 0) <= 0)) {
    return { text: "", error: "Living area must be a positive number when provided." };
  }

  const hasLot = typeof lotRaw === "string" && lotRaw.trim().length > 0;
  const lot = hasLot ? Number(lotRaw) : undefined;
  if (hasLot && (!Number.isFinite(lot) || (lot ?? 0) <= 0)) {
    return { text: "", error: "Lot size must be a positive number when provided." };
  }

  const hasYear = typeof yearRaw === "string" && yearRaw.trim().length > 0;
  const year = hasYear ? Number(yearRaw) : undefined;
  if (hasYear && (!Number.isFinite(year) || year <= 0)) {
    return { text: "", error: "Year built must be a valid number when provided." };
  }

  const bedrooms = bedroomsStr ? (bedroomsStr.toLowerCase() === "studio" ? "Studio" : bedroomsStr) : null;
  const bathrooms = bathroomsStr || null;

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { text: "", error: "You must be signed in to use the generator." };
  }

  const streetViewImage = await fetchStreetViewImage(location);
  const hasStreetViewImage = Boolean(streetViewImage);

  const userPlan = await getUserPlan(userId);
  const planType = userPlan.planType;
  const planLimit = (REAL_ESTATE_LIMITS as Record<string, number | null>)[planType] ?? null;

  const quota = await consumeRealEstateQuota(userId, planType, userPlan.currentPeriodEnd ?? null);
  if (!quota.ok) {
    const usagePayload =
      planLimit === null
        ? { limit: null, remaining: null, used: null }
        : {
            limit: planLimit,
            remaining: 0,
            used: planLimit,
          };

    return { text: "", error: quota.error, usage: usagePayload };
  }

  const optionalContextFacts: string[] = [];
  if (propertyType) {
    optionalContextFacts.push(`Agent believes the property is a ${propertyType}.`);
  }
  optionalContextFacts.push(listingType === "rent" ? "Listing objective: rent the home." : "Listing objective: sell the home.");
  optionalContextFacts.push(`Requested tone: ${tone}. Keep it MLS-safe even if playful.`);
  if (bedrooms) {
    optionalContextFacts.push(`Exact bedroom count to respect: ${bedrooms}.`);
  }
  if (bathrooms) {
    optionalContextFacts.push(`Exact bathroom count to respect: ${bathrooms}.`);
  }
  if (area) {
    optionalContextFacts.push(`Interior area (internal reference only): ${area} sq ft.`);
  }
  if (lot) {
    optionalContextFacts.push(`Lot size (internal reference only): ${lot} sq ft.`);
  }
  if (year) {
    optionalContextFacts.push(`Year built from agent notes: ${year}.`);
  }
  if (hasPrice && typeof price === "number") {
    optionalContextFacts.push(`Pricing guidance (internal only): ${price} USD. Never mention exact prices.`);
  }
  if (amenitiesSelected.length) {
    optionalContextFacts.push(`Amenities to weave in: ${amenitiesSelected.join(", ")}.`);
  }
  if (description) {
    optionalContextFacts.push(`Agent notes: ${description}.`);
  }
  if (agentContact) {
    optionalContextFacts.push(`Agent contact (context only): ${agentContact}.`);
  }

  const additionalContext =
    optionalContextFacts.length > 0
      ? optionalContextFacts.map((fact) => `- ${fact}`).join("\n")
      : "- No additional specs were provided.";

  const sharedFormatInstructions = `
Task 3 — Write the listing:
- 1 bold title (max 12 words).
- 1 italicized summary (2–3 sentences).
- 2–3 marketing paragraphs that feel like an MLS-ready narrative.
- A "Highlights:" label followed by 5–7 punchy bullet points (one benefit each).
- A final line of 3–5 localized hashtags.

Rules:
- Never mention cameras, Street View, or that you are inferring or missing data.
- Match this tone: ${tone}. Stay confident, as if you walked the property, and keep it MLS-safe even when playful.
- Do NOT mention price, taxes, HOA dues, or exact square footage (even if provided).
- Keep the language professional, vivid, and grounded in real observations.
- Output every word in ${language}.
- After the hashtags, append a metadata block like <metadata>{"propertyType":"","listingType":"","bedrooms":"","bathrooms":"","language":"","amenities":["",""]}</metadata> so we can parse it.
`;

  const system = hasStreetViewImage
    ? `
You are a real estate analyst and listing description writer.
You receive a property address plus a live Google Street View photo showing the exterior.

Task 1 — Analyze the image:
- Identify architecture/style, exterior materials, and number of floors.
- Note visible condition, driveway/garage/balcony/porch elements, landscaping, and curb appeal.
- Determine the surrounding vibe (quiet suburban street, coastal corridor, dense urban block, etc.).

Task 2 — Blend image insights with the address:
- Infer the likely property type, layout expectations, and lifestyle perks common to the neighborhood.
- Use local knowledge (parks, cafes, waterfront, transit access) to enrich the story.
${sharedFormatInstructions}
`
    : `
You are a real estate analyst and listing description writer.
You only receive a property address plus optional agent notes—no photos.

Task 1 — Analyze the address context:
- Use knowledge about local architecture, climate, and buyer expectations to infer a realistic property profile (type, style, condition).
- Estimate a plausible bedroom/bathroom mix, number of floors, and standout exterior elements that fit the neighborhood.

Task 2 — Use location cues:
- Describe lifestyle perks tied to the area (schools, nightlife, beaches, tech hubs, mountain escapes, etc.).
- Reference regional finishes, landscaping, or amenities that commonly appear near the provided address.
${sharedFormatInstructions}
`;

  const user = hasStreetViewImage
    ? `
Street address: ${location}
Listing objective: ${listingType === "rent" ? "For rent" : "For sale"}
Language: ${language}
Preferred tone: ${tone} (keep it credible and MLS-ready)

Additional context to respect:
${additionalContext}

Treat the Street View photo as a real inspection. Never explain that you're guessing, and never mention the photo. The metadata block must use lowercase "sale"/"rent" for listingType, keep amenities concise nouns, and stay valid JSON.
`
    : `
Street address: ${location}
Listing objective: ${listingType === "rent" ? "For rent" : "For sale"}
Language: ${language}
Preferred tone: ${tone} (keep it credible and MLS-ready)

Additional context to respect:
${additionalContext}

You do not have imagery. Infer a realistic property and neighborhood profile using what is typical for this address. Never mention that you are inferring, and never reference missing data. The metadata block must use lowercase "sale"/"rent" for listingType, keep amenities concise nouns, and stay valid JSON.
`;

  try {
    const userContent: Array<
      | { type: "input_text"; text: string }
      | { type: "input_image"; image_url: string; detail: "low" | "high" | "auto" }
    > = [{ type: "input_text", text: user.trim() }];
    if (streetViewImage) {
      userContent.push({ type: "input_image", image_url: streetViewImage, detail: "high" });
    }

    const resp = await openai.responses.create({
      model: "gpt-5-mini",
      input: [
        { role: "system", content: [{ type: "input_text", text: system.trim() }] },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const rawText = resp.output_text?.trim() || "";
    if (!rawText) {
      return { text: "", error: "Empty response from model." };
    }

    const { cleanedText, metadata } = stripMetadataBlock(rawText);
    const structured = extractStructuredOutput(cleanedText);

    const metadataListingType = metadata.listingType?.toLowerCase();
    const normalizedListingType =
      metadataListingType === "rent" ? "rent" : metadataListingType === "sale" ? "sale" : listingType;
    const normalizedPropertyType = metadata.propertyType?.trim() || propertyType || "Image-analyzed property";
    const metadataBedrooms = metadata.bedrooms?.trim();
    const metadataBathrooms = metadata.bathrooms?.trim();
    const metadataLanguage = metadata.language?.trim();
    const metadataAmenities =
      Array.isArray(metadata.amenities) && metadata.amenities.length
        ? metadata.amenities
            .map((item) => (typeof item === "string" ? item.trim() : ""))
            .filter(Boolean)
        : [];

    let historyId: string | undefined;
    try {
      historyId = await saveRealEstateGeneration({
        userId,
        planType,
        title: structured.title,
        text: cleanedText,
        hashtags: structured.hashtags,
        propertyType: normalizedPropertyType,
        listingType: normalizedListingType,
        location,
        price: Number.isFinite(price ?? NaN) ? (price as number) : null,
        bedrooms: metadataBedrooms || bedrooms,
        bathrooms: metadataBathrooms || bathrooms,
        language: metadataLanguage || language,
        amenities: metadataAmenities.length ? metadataAmenities : amenitiesSelected,
        streetViewImage,
      });
    } catch (saveError) {
      console.error("Failed to save real estate generation history", saveError);
    }

    const remainingAfterUsage = quota.limit === null ? null : Math.max(quota.remaining ?? 0, 0);
    const usagePayload =
      quota.limit === null
        ? { limit: null, remaining: null, used: null }
        : {
            limit: quota.limit,
            remaining: remainingAfterUsage,
            used:
              remainingAfterUsage === null
                ? null
                : Math.min(quota.limit, quota.limit - remainingAfterUsage),
          };

    return {
      text: cleanedText,
      title: structured.title,
      hashtags: structured.hashtags,
      historyId,
      streetViewImage,
      usage: usagePayload,
    };
  } catch (err) {
    console.error("Error generating description:", err);
    await restoreRealEstateQuota(userId, planType, userPlan.currentPeriodEnd ?? null);
    const restoredUsage =
      quota.limit === null
        ? { limit: null, remaining: null, used: null }
        : {
            limit: quota.limit,
            remaining: Math.min((quota.remaining ?? 0) + 1, quota.limit),
            used: Math.max(quota.limit - Math.min((quota.remaining ?? 0) + 1, quota.limit), 0),
          };

    return {
      text: "",
      error: "An unexpected error occurred. Please try again later.",
      streetViewImage: null,
      usage: restoredUsage,
    };
  }
}



// "use server";

// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// type State = {
//   text: string;
//   error?: string;
// };

// interface RealEstateData {
//   propertyType: string;
//   location: string;
//   price: number;
//   listingType: "Sale" | "Rent";
//   bedrooms: number;
//   bathrooms: number;
//   livingArea: number;
//   lotSize?: number;
//   yearBuilt?: number;
//   description?: string;
//   name?: string;
//   email?: string;
//   phone?: string;
//   features?: string[];
// }

// export async function genererateRealEstateDescription(prev: State, formData: FormData): Promise<State> {
//   const data: RealEstateData = {
//     propertyType: formData.get("propertyType")?.toString() || "",
//     location: formData.get("location")?.toString() || "",
//     price: Number(formData.get("price") || 0),
//     listingType: (formData.get("listingType")?.toString() as "Sale" | "Rent") || "Sale",
//     bedrooms: Number(formData.get("bedrooms") || 0),
//     bathrooms: Number(formData.get("bathrooms") || 0),
//     livingArea: Number(formData.get("livingArea") || 0),
//     lotSize: formData.get("lotSize") ? Number(formData.get("lotSize")) : undefined,
//     yearBuilt: formData.get("yearBuilt") ? Number(formData.get("yearBuilt")) : undefined,
//     description: formData.get("description")?.toString() || "",
//     name: formData.get("name")?.toString() || "",
//     email: formData.get("email")?.toString() || "",
//     phone: formData.get("phone")?.toString() || "",
//     features: formData.getAll("features").map((f) => f.toString()),
//   };

//   // Basic validation
//   if (!data.propertyType || !data.location || !data.price || !data.bedrooms || !data.bathrooms || !data.livingArea) {
//     return { text: "", error: "Please fill in all required fields." };
//   }
//   if (data.price <= 0 || data.bedrooms <= 0 || data.bathrooms <= 0 || data.livingArea <= 0) {
//     return { text: "", error: "Price, bedrooms, bathrooms, and living area must be positive numbers." };
//   }

//   // Build the property description
//   const system = `
// You are a professional real estate copywriter.
// Write clear, market-ready property listings that are attractive, realistic, and persuasive.
// Avoid clichés and keep the text aligned with current real estate market practices.
// Length: 120–200 words, 2–3 short paragraphs.
// Tone: professional yet friendly.
// `;

//   const user = `
// Property details:
// - Property type: ${data.propertyType}
// - Listing type: ${data.listingType}
// - Location: ${data.location}
// - Price: ${data.price} USD
// - Living area: ${data.livingArea} sq ft
// - Lot size: ${data.lotSize} sq ft
// - Year built: ${data.yearBuilt}
// - Bedrooms: ${data.bedrooms}
// - Bathrooms: ${data.bathrooms}
// - Features: ${data.features ? data.features.join(", ") : "—"}
// - Additional notes: ${data.description || "—"}

// Instructions:
// 1) Highlight the main selling points (space, location, modern design, features).
// 2) Focus on safety, comfort, transportation, schools, shops, and nearby amenities.
// 3) Keep it natural, clear, persuasive — no filler.
// 4) Avoid clichés like “unique opportunity” or “ultimate luxury”.
// 5) 120–200 words in 2–3 short paragraphs.
// `;

//   try {
//     // const response = await fetch("https://api.openai.com/v1/chat/completions", {
//     //   method: "POST",
//     //   headers: {
//     //     "Content-Type": "application/json",
//     //     Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//     //   },
//     //   body: JSON.stringify({
//     //     model: "gpt-4",
//     //     messages: [{ role: "user", content: prompt }],
//     //     max_tokens: 500,
//     //     temperature: 0.7,
//     //   }),
//     // });

//     const response = await openai.responses.create({
//       model: "gpt-5-mini",
//       input: [
//         {
//           role: "system",
//           content: system,
//         },
//         {
//           role: "user",
//           content: user,
//         },
//       ],
//     });

//     const result = await response;
//     const text = result.output.content.text;
//     // const description = result.choices[0].message.content.trim();

//     return { text: description };
//   } catch (error) {
//     console.error("Error generating description:", error);
//     return { text: "", error: "An unexpected error occurred. Please try again later." };
//   }
// }
