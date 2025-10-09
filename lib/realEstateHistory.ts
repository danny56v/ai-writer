import { ObjectId } from "mongodb";

import { db } from "@/lib/db";
import type { PlanKey } from "@/lib/plans";

export type RealEstateHistoryDocument = {
  _id?: ObjectId;
  userId: ObjectId;
  planType: PlanKey;
  title: string;
  text: string;
  hashtags: string[];
  propertyType: string;
  listingType: string;
  location: string;
  price: number | null;
  bedrooms: string | null;
  bathrooms: string | null;
  language: string;
  amenities: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type RealEstateHistoryEntry = {
  id: string;
  title: string;
  text: string;
  hashtags: string[];
  propertyType: string;
  listingType: string;
  location: string;
  price: number | null;
  bedrooms: string | null;
  bathrooms: string | null;
  language: string;
  amenities: string[];
  createdAt: string;
};

export function extractStructuredOutput(text: string) {
  const trimmed = text.trim();
  const paragraphs = trimmed
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  let title: string | null = null;
  let hashtags: string[] = [];

  if (paragraphs.length > 0) {
    const maybeTitle = paragraphs[0];
    const match = maybeTitle.match(/^\*\*(.+?)\*\*$/);
    if (match) {
      title = match[1].trim();
      paragraphs.shift();
    }
  }

  if (paragraphs.length > 0) {
    const maybeHashtags = paragraphs[paragraphs.length - 1];
    if (/(^|\s)#/.test(maybeHashtags)) {
      const extracted = maybeHashtags
        .split(/\s+/)
        .map((tag) => tag.trim())
        .filter((tag) => tag.startsWith("#"));

      if (extracted.length) {
        hashtags = extracted;
        paragraphs.pop();
      }
    }
  }

  return {
    title,
    hashtags,
    bodyParagraphs: paragraphs,
  };
}

export async function saveRealEstateGeneration(args: {
  userId: string;
  planType: PlanKey;
  title: string | null;
  text: string;
  hashtags: string[];
  propertyType: string;
  listingType: string;
  location: string;
  price: number | null;
  bedrooms: string | null;
  bathrooms: string | null;
  language: string;
  amenities: string[];
}) {
  const database = await db();
  const collection = database.collection<RealEstateHistoryDocument>("realEstateGenerations");

  const now = new Date();
  const doc: RealEstateHistoryDocument = {
    userId: new ObjectId(args.userId),
    planType: args.planType,
    title: args.title ?? "Untitled listing",
    text: args.text,
    hashtags: args.hashtags,
    propertyType: args.propertyType,
    listingType: args.listingType,
    location: args.location,
    price: Number.isFinite(args.price ?? NaN) ? args.price : null,
    bedrooms: args.bedrooms,
    bathrooms: args.bathrooms,
    language: args.language,
    amenities: args.amenities,
    createdAt: now,
    updatedAt: now,
  };

  const result = await collection.insertOne(doc);
  return result.insertedId.toHexString();
}

export async function getRealEstateHistory(userId: string, limit = 20): Promise<RealEstateHistoryEntry[]> {
  const database = await db();
  const collection = database.collection<RealEstateHistoryDocument>("realEstateGenerations");

  const cursor = collection
    .find({ userId: new ObjectId(userId) })
    .sort({ createdAt: -1 })
    .limit(limit);

  const documents = await cursor.toArray();

  return documents.map((doc) => ({
    id: doc._id!.toHexString(),
    title: doc.title,
    text: doc.text,
    hashtags: doc.hashtags,
    propertyType: doc.propertyType,
    listingType: doc.listingType,
    location: doc.location,
    price: doc.price ?? null,
    bedrooms: doc.bedrooms ?? null,
    bathrooms: doc.bathrooms ?? null,
    language: doc.language,
    amenities: doc.amenities,
    createdAt: doc.createdAt.toISOString(),
  }));
}
