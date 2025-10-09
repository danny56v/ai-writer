"use server";

import OpenAI from "openai";
import { ObjectId } from "mongodb";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getUserPlan } from "@/lib/billing";
import type { PlanKey } from "@/lib/plans";
import { extractStructuredOutput, saveRealEstateGeneration } from "@/lib/realEstateHistory";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export type RealEstateDescriptionState = {
  text: string;
  title?: string | null;
  hashtags?: string[];
  historyId?: string;
  error?: string;
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
  // Read the exact same keys as defined in the form
  const propertyType = (formData.get("propertyType") as string) || "";
  const location     = (formData.get("location") as string) || "";
  const priceRaw     = formData.get("price");
  const listingType  = ((formData.get("listingType") as string) || "sale").toLowerCase(); // "sale" | "rent"
  const bedroomsStr  = (formData.get("bedrooms") as string) || "";  // poate fi "Studio"
  const bathroomsStr = (formData.get("bathrooms") as string) || ""; // poate fi "1", "2"...
  const areaRaw      = formData.get("area");
  const lotRaw       = formData.get("lot");
  const yearRaw      = formData.get("year");
  const description  = (formData.get("description") as string) || "";
  const name         = (formData.get("name") as string) || "";
  const email        = (formData.get("email") as string) || "";
  const phone        = (formData.get("phone") as string) || "";
  const languageRaw  = (formData.get("language") as string) || "English";
  const language     = languageRaw.trim() || "English";
  const amenitiesSelected = formData.getAll("amenities").map(String);

  const agentContact = [name, email, phone].filter(Boolean).join(" • ") || "—";

  // Normalize numeric fields
  const price = priceRaw ? Number(priceRaw) : NaN;
  const area  = areaRaw  ? Number(areaRaw)  : undefined;
  const lot   = lotRaw   ? Number(lotRaw)   : undefined;
  const year  = yearRaw  ? Number(yearRaw)  : undefined;

  // Bedrooms/bathrooms may come through as "Studio" or numeric strings
  const bedrooms = bedroomsStr.toLowerCase() === "studio" ? "Studio" : bedroomsStr || "-";
  const bathrooms = bathroomsStr || "-";

  // Minimal validation
  if (!propertyType || !location || !priceRaw) {
    return { text: "", error: "Please fill in property type, location, and price." };
  }
  if (!Number.isFinite(price) || price <= 0) {
    return { text: "", error: "Price must be a positive number." };
  }
  if (areaRaw) {
    if (area === undefined || !Number.isFinite(area) || area <= 0) {
      return { text: "", error: "Living area must be a positive number when provided." };
    }
  }

  // System + User prompt
const system = `
You are a professional real estate copywriter.
Write clear, market-ready property listings that are attractive, realistic, and persuasive.
Avoid clichés and keep the text aligned with current real estate market practices.
Length: 120–200 words, 2–3 short paragraphs.
Tone: professional yet friendly.
Return Markdown with a bold title on the first line, descriptive paragraphs, and a final line of 3–5 relevant hashtags.
`;

  const livingAreaText = area !== undefined ? `${area} m²` : "—";

  const user = `
Property details:
- Property type: ${propertyType}
- Listing type: ${listingType === "sale" ? "for sale" : "for rent"}
- Location: ${location}
- Price: ${price} USD
- Living area: ${livingAreaText}
- Lot size: ${lot ?? "—"} m²
- Year built: ${year ?? "—"}
- Bedrooms: ${bedrooms}
- Bathrooms: ${bathrooms}
- Features: ${amenitiesSelected.length ? amenitiesSelected.join(", ") : "—"}
- Additional notes: ${description || "—"}
- Agent contact: ${agentContact}
- Preferred language: ${language}

Instructions:
1) Highlight the main selling points (space, location, modern design, features).
2) Focus on safety, comfort, transportation, schools, shops, and nearby amenities.
3) Keep it natural, clear, persuasive — no filler.
4) Avoid clichés like “unique opportunity” or “ultimate luxury”.
5) 120–200 words in 2–3 short paragraphs.
6) Write the entire listing in ${language}.
7) Output format:
   - First line: **Concise listing title** (max 12 words).
   - Then the body paragraphs separated by blank lines.
   - Final line: three to five hashtags with localized keywords (e.g., #ModernLoft).
`;

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { text: "", error: "You must be signed in to use the generator." };
  }

  const userPlan = await getUserPlan(userId);
  const planType = userPlan.planType;

  const quota = await consumeRealEstateQuota(userId, planType, userPlan.currentPeriodEnd ?? null);
  if (!quota.ok) {
    return { text: "", error: quota.error };
  }

  try {
    const resp = await openai.responses.create({
      model: "gpt-5-mini",
      input: [
        { role: "system", content: system },
        { role: "user",   content: user   },
      ],
      // temperature: 0.7,
      // max_output_tokens: 400, // echivalent pt lungime ~200cuv
    });

    // Cel mai simplu extractor pentru SDK-ul nou:
    const text = resp.output_text?.trim() || "";

    if (!text) return { text: "", error: "Empty response from model." };

    const structured = extractStructuredOutput(text);

    let historyId: string | undefined;
    try {
      historyId = await saveRealEstateGeneration({
        userId,
        planType,
        title: structured.title,
        text,
        hashtags: structured.hashtags,
        propertyType,
        listingType,
        location,
        price: Number.isFinite(price) ? price : null,
        bedrooms,
        bathrooms,
        language,
        amenities: amenitiesSelected,
      });
    } catch (saveError) {
      console.error("Failed to save real estate generation history", saveError);
    }

    return { text, title: structured.title, hashtags: structured.hashtags, historyId };
  } catch (err) {
    console.error("Error generating description:", err);
    await restoreRealEstateQuota(userId, planType, userPlan.currentPeriodEnd ?? null);
    return { text: "", error: "An unexpected error occurred. Please try again later." };
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
// - Living area: ${data.livingArea} m²
// - Lot size: ${data.lotSize} m²
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
