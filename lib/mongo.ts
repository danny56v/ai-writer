import { Db, MongoClient, ObjectId } from "mongodb";

let client: MongoClient;
let db: Db;

export const connectToDatabase = async () => {
  try {
    if (db) {
      return { db };
    }
    if (!process.env.MONGODB_URI) {
      throw new Error("Missing MONGODB_URI environment variable");
    }
    client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    db = client.db(process.env.MONGODB_DB!);
    return { db };
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    if (client) {
      await client.close();
    }
    throw new Error("Failed to connect to the database");
  }
};

export type Subscription = {
  userId: string;
  customerId: string;
  subscriptionId: string;
  priceId: string;
  status: "pending" | "active" | "failed" | "canceled";
  createdAt: Date;
  updatedAt: Date;
};

export interface Customer {
  _id?: ObjectId;
  userId: string;
  customerId: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function createOrUpdateSubscription(sub: Subscription): Promise<void> {
  try {
    const { db } = await connectToDatabase();

    await db.collection<Subscription>("subscriptions").updateOne(
      { userId: sub.userId }, // actualizăm pe baza userId
      { $set: { ...sub } }, // actualizăm toate câmpurile
      { upsert: true } // dacă nu există, îl creează
    );

    console.log(`✅ Subscription saved for user ${sub.userId}`);
  } catch (error) {
    console.error("❌ Error saving subscription:", error);
  }
}

export async function createOrUpdateCustomer(customer: Customer): Promise<void> {
  try {
    const { db } = await connectToDatabase();

    await db.collection<Customer>("customers").updateOne(
      { customerId: customer.customerId },
      {
        $set: {
          userId: customer.userId,
          email: customer.email,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    console.log(`✅ Customer saved: ${customer.customerId}`);
  } catch (error) {
    console.error("❌ Error in createOrUpdateCustomer:", error);
    throw error;
  }
}

export async function getUserIdByCustomerId(customerId: string): Promise<string | null> {
  try {
    const { db } = await connectToDatabase();
    const customer = await db.collection<Customer>("customers").findOne({ customerId });

    return customer?.userId || null;
  } catch (error) {
    console.error("❌ Error in getUserIdByCustomerId:", error);
    return null;
  }
}

export async function getCustomer(userId: string): Promise<{
  userId: string;
  customerId: string;
  email: string;
} | null> {
  try {
    const { db } = await connectToDatabase();
    const res = await db.collection("customers").findOne({ userId });
    return res
      ? {
          userId: res.userId,
          customerId: res.customerId,
          email: res.email,
        }
      : null;
  } catch (error) {
    console.error("Error getting customer:", error);
    return null;
  }
}

// Funcție pentru verificarea rapidă a statusului subscription
export async function checkUserSubscriptionStatus(userId: string): Promise<{
  hasSubscription: boolean;
  isActive: boolean;
  planType?: string;
}> {
  try {
    const { db } = await connectToDatabase();
    const subscription = await db.collection("subscriptions").findOne({ userId });

    if (!subscription) {
      return {
        hasSubscription: false,
        isActive: false,
      };
    }

    return {
      hasSubscription: true,
      isActive: subscription.status === "active",
      planType: subscription.planType || "unknown",
    };
  } catch (error) {
    console.error("Error checking subscription status:", error);
    return {
      hasSubscription: false,
      isActive: false,
    };
  }
}