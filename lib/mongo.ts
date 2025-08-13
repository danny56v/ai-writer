import { Db, MongoClient } from "mongodb";
import { Customer, Subscription } from "./models/subscription";
import Stripe from "stripe";

let client: MongoClient;
let db: Db;

export const connectToDatabase = async () => {
  if (db) {
    return { db };
  }
  client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();
  db = client.db(process.env.MONGODB_DB!);
  return { db };
};

export async function createOrUpdateCustomer(data: Customer) {
  try {
    const { db } = await connectToDatabase();
    await db
      .collection("customers")
      .updateOne({ userId: data.userId }, { $set: { ...data, updatedAt: new Date() } }, { upsert: true });
  } catch (error) {
    console.error("Error creating/updating customer:", error);
    throw new Error("Failed to create or update customer");
  }
}

export async function createOrUpdateSubscription(data: Subscription) {
  try {
    const { db } = await connectToDatabase();
    await db
      .collection("subscriptions")
      .updateOne(
        { stripeSubscriptionId: data.stripeSubscriptionId },
        { $set: { ...data, updatedAt: new Date() } },
        { upsert: true }
      );
  } catch (error) {
    console.error("Error creating/updating subscription:", error);
    throw new Error("Failed to create or update subscription");
  }
}

export async function deleteSunscription(data: Subscription) {
  try {
    const { db } = await connectToDatabase();
    await db.collection("subscriptions").deleteOne({ stripeSubscriptionId: data.stripeSubscriptionId });
  } catch (error) {
    console.error("Error deleting subscription:", error);
    throw new Error("Failed to delete subscription");
  }
}


export async function getCustomer(userId: string): Promise<Customer | null> {
  try {
    const { db } = await connectToDatabase();
    return await db.collection<Customer>('customers')
      .findOne({ userId });
  } catch (error) {
    console.error('Error getting customer:', error);
    return null;
  }
}
//

// export const getUserById = async (userId: string) => {
//   try {
//     const { db } = await connectToDatabase();
//     return await db.collection("users").findOne({ _id: new ObjectId(userId) });
//   } catch (error) {
//     console.error("Error getting user:", error);
//     return null;
//   }
// };

// export const getUserByEmail = async (email: string) => {
//   try {
//     const { db } = await connectToDatabase();
//     return await db.collection("users").findOne({ email });
//   } catch (error) {
//     console.error("Error getting user by email:", error);
//     return null;
//   }
// };

// export const getSubscription = async (userId: string): Promise<Subscription | null> => {
//   try {
//     const { db } = await connectToDatabase();
//     return await db.collection<Subscription>("subscriptions").findOne({ userId });
//   } catch (error) {
//     console.error("Error getting subscription:", error);
//     return null;
//   }
// };



// export async function createOrUpdateSubscription(subscription: Subscription): Promise<void> {
//   try {
//     const { db } = await connectToDatabase();
//     await db.collection<Subscription>('subscriptions')
//       .replaceOne(
//         { userId: subscription.userId },
//         { ...subscription, updatedAt: new Date() },
//         { upsert: true }
//       );

//     console.log(`Subscription updated for user ${subscription.userId}`);
//   } catch (error) {
//     console.error('Error creating/updating subscription:', error);
//     throw error;
//   }
// }

// export async function createOrUpdateCustomer(customer: Customer): Promise<void> {
//   try {
//     const { db } = await connectToDatabase();
//     await db.collection<Customer>('customers')
//       .replaceOne(
//         { userId: customer.userId },
//         { ...customer, updatedAt: new Date() },
//         { upsert: true }
//       );

//     console.log(`Customer updated for user ${customer.userId}`);
//   } catch (error) {
//     console.error('Error creating/updating customer:', error);
//     throw error;
//   }
// }

// // Funcție helper pentru a obține informații complete despre user + subscription
// export async function getUserWithSubscription(userId: string) {
//   try {
//     const { db } = await connectToDatabase();

//     const [user, subscription, customer] = await Promise.all([
//       db.collection('users').findOne({ _id: new ObjectId(userId) }),
//       db.collection<Subscription>('subscriptions').findOne({ userId }),
//       db.collection<Customer>('customers').findOne({ userId })
//     ]);

//     return {
//       user,
//       subscription,
//       customer
//     };
//   } catch (error) {
//     console.error('Error getting user with subscription:', error);
//     return { user: null, subscription: null, customer: null };
//   }
// }

// // Pentru debugging - vezi toate datele unui user
// export async function debugUserData(userId: string) {
//   const { db } = await connectToDatabase();

//   const userData = await db.collection('users').findOne({ _id: new ObjectId(userId) });
//   const subscription = await db.collection('subscriptions').findOne({ userId });
//   const customer = await db.collection('customers').findOne({ userId });

//   console.log('=== DEBUG USER DATA ===');
//   console.log('User:', userData);
//   console.log('Subscription:', subscription);
//   console.log('Customer:', customer);
//   console.log('=====================');

//   return { userData, subscription, customer };
// }

// // Funcții pentru statistici (opțional)
// export async function getSubscriptionStats(): Promise<{
//   total: number;
//   active: number;
//   canceled: number;
//   trial: number;
// }> {
//   try {
//     const { db } = await connectToDatabase();

//     const [total, active, canceled, trial] = await Promise.all([
//       db.collection('subscriptions').countDocuments(),
//       db.collection('subscriptions').countDocuments({ status: 'active' }),
//       db.collection('subscriptions').countDocuments({ status: 'canceled' }),
//       db.collection('subscriptions').countDocuments({ status: 'trialing' })
//     ]);

//     return { total, active, canceled, trial };
//   } catch (error) {
//     console.error('Error getting subscription stats:', error);
//     return { total: 0, active: 0, canceled: 0, trial: 0 };
//   }
// }
