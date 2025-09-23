"use server";

import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export type RealEstateDescriptionState = { text: string; error?: string };

export async function genererateRealEstateDescription(
  _prev: RealEstateDescriptionState,
  formData: FormData
): Promise<RealEstateDescriptionState> {
  // Citește exact aceleași chei ca în <form>
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
  const features   = formData.getAll("features").map(String); // ["pool","garage",...]

  // Normalizează numeric
  const price = priceRaw ? Number(priceRaw) : 0;
  const area  = areaRaw  ? Number(areaRaw)  : 0;
  const lot   = lotRaw   ? Number(lotRaw)   : undefined;
  const year  = yearRaw  ? Number(yearRaw)  : undefined;

  // Bedrooms/Bathrooms pot veni ca "Studio" sau stringuri numerice
  const bedrooms = bedroomsStr.toLowerCase() === "studio" ? "Studio" : bedroomsStr || "-";
  const bathrooms = bathroomsStr || "-";

  // Validare minimă
  if (!propertyType || !location || !price || !area) {
    return { text: "", error: "Please fill in property type, location, price and living area." };
  }
  if (price <= 0 || area <= 0) {
    return { text: "", error: "Price and living area must be positive numbers." };
  }

  // System + User prompt
  const system = `
You are a professional real estate copywriter.
Write clear, market-ready property listings that are attractive, realistic, and persuasive.
Avoid clichés and keep the text aligned with current real estate market practices.
Length: 120–200 words, 2–3 short paragraphs.
Tone: professional yet friendly.
`;

  const user = `
Property details:
- Property type: ${propertyType}
- Listing type: ${listingType === "sale" ? "for sale" : "for rent"}
- Location: ${location}
- Price: ${price} USD
- Living area: ${area} m²
- Lot size: ${lot ?? "—"} m²
- Year built: ${year ?? "—"}
- Bedrooms: ${bedrooms}
- Bathrooms: ${bathrooms}
- Features: ${features.length ? features.join(", ") : "—"}
- Additional notes: ${description || "—"}

Instructions:
1) Highlight the main selling points (space, location, modern design, features).
2) Focus on safety, comfort, transportation, schools, shops, and nearby amenities.
3) Keep it natural, clear, persuasive — no filler.
4) Avoid clichés like “unique opportunity” or “ultimate luxury”.
5) 120–200 words in 2–3 short paragraphs.
`;

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

    return { text };
  } catch (err) {
    console.error("Error generating description:", err);
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

//   // Validare simplă
//   if (!data.propertyType || !data.location || !data.price || !data.bedrooms || !data.bathrooms || !data.livingArea) {
//     return { text: "", error: "Please fill in all required fields." };
//   }
//   if (data.price <= 0 || data.bedrooms <= 0 || data.bathrooms <= 0 || data.livingArea <= 0) {
//     return { text: "", error: "Price, bedrooms, bathrooms, and living area must be positive numbers." };
//   }

//   // Construim descrierea proprietății
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
