
import { MongoClient } from "mongodb";
const uri = 'mongodb+srv://admin:admin@cluster0.gf2crvq.mongodb.net/ai-writer?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'ai-writer';

(async () => {
  const c = await new MongoClient(uri).connect();
  const d = c.db(dbName);

  await d.collection("users").createIndex({ email: 1 }, { unique: true });
  await d.collection("users").createIndex({ stripeCustomerId: 1 }, { unique: true, sparse: true });

  await d.collection("subscriptions").createIndex({ stripeSubscriptionId: 1 }, { unique: true });
  await d.collection("subscriptions").createIndex({ userId: 1, currentPeriodEnd: -1 });
  await d.collection("subscriptions").createIndex(
    { userId: 1, status: 1 },
    { unique: true, partialFilterExpression: { status: { $in: ["trialing","active","past_due"] } } }
  );

  await d.collection("usages").createIndex({ userId: 1, year: 1, month: 1 }, { unique: true });
  console.log("Indexes created");
  await c.close();
})();
