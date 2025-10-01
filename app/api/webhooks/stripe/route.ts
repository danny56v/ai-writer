// /app/api/webhooks/stripe/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { planFromPrice } from "@/lib/plans";

// ---------- Utils ----------
const toDate = (sec?: number | null) => (typeof sec === "number" ? new Date(sec * 1000) : undefined);

/** Pick the relevant subscription item (typically there is only one). */
function pickPlanItem(sub: Stripe.Subscription) {
  const items = sub.items?.data ?? [];
  return items[0]; // Adjust this if you ever attach multiple prices to the same subscription
}

/** Resolve our internal user id from the Stripe payload. */
async function resolveUserId(
  d: Awaited<ReturnType<typeof db>>,
  opts: { stripeCustomerId?: string | null; email?: string | null; metaUserId?: string | null }
): Promise<string | null> {
  const { stripeCustomerId, email, metaUserId } = opts;
  if (stripeCustomerId) {
    const byCust = await d.collection("users").findOne({ stripeCustomerId });
    if (byCust?._id) return byCust._id.toString();
  }
  if (email) {
    const byEmail = await d.collection("users").findOne({ email });
    if (byEmail?._id) return byEmail._id.toString();
  }
  return metaUserId ?? null;
}

/** Upsert subscription data in Mongo, reading the period from the first line item. */
async function upsertSubscription(sub: Stripe.Subscription, userId?: string | null) {
  const d = await db();
  const item = pickPlanItem(sub);
  const priceId = item?.price?.id ?? null;

  // Determine the current period window; fall back to subscription-level timestamps when item data is missing.
  const currentPeriodStart = toDate(item?.current_period_start) ?? toDate(sub.start_date);
  const currentPeriodEnd = toDate(item?.current_period_end) ?? undefined;

  await d.collection("subscriptions").updateOne(
    { stripeSubscriptionId: sub.id },
    {
      $set: {
        ...(userId ? { userId } : {}),
        stripePriceId: priceId,
        status: sub.status,
        planType: planFromPrice(priceId ?? undefined), // Falls back to "free" when the price is unknown
        currentPeriodStart: currentPeriodStart ?? new Date(),
        currentPeriodEnd: currentPeriodEnd ?? new Date(),
        cancelAtPeriodEnd: sub.cancel_at_period_end ?? false,
        // Helpful debug/UI fields
        canceledAt: toDate(sub.canceled_at) ?? null,
        cancelAt: toDate(sub.cancel_at) ?? null,
        endedAt: toDate(sub.ended_at) ?? null,
        latestInvoiceId: typeof sub.latest_invoice === "string" ? sub.latest_invoice : sub.latest_invoice?.id ?? null,
        updatedAt: new Date(),
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true }
  );
}

// ---------- Handler ----------
export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });

  const raw = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Invalid Stripe signature:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    const d = await db();

    switch (event.type) {
      // 1) After a completed checkout: attach stripeCustomerId (if missing) and sync the subscription record
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;

        const stripeCustomerId = (s.customer as string) || null;
        const stripeSubscriptionId = (s.subscription as string) || null;

        // Try to ensure we have an email address
        let email: string | null = s.customer_details?.email ?? null;
        if (!email && stripeCustomerId) {
          const cust = (await stripe.customers.retrieve(stripeCustomerId)) as Stripe.Customer;
          email = cust.email ?? null;
        }

        const userId = await resolveUserId(d, {
          stripeCustomerId,
          email,
          metaUserId: s.metadata?.userId ?? null,
        });

        // Attach the stripeCustomerId to the user if it wasn’t stored yet
        if (userId && stripeCustomerId) {
          await d
            .collection("users")
            .updateOne({ _id: new ObjectId(userId) }, { $set: { stripeCustomerId, updatedAt: new Date() } });
        }

        // Sync the subscription payload
        if (stripeSubscriptionId) {
          const sub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
          await upsertSubscription(sub, userId);
        }
        break;
      }

      // 2) Subscription lifecycle events → keep our record up to date
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = await resolveUserId(d, {
          stripeCustomerId: sub.customer as string,
          email: null,
          metaUserId: null,
        });
        await upsertSubscription(sub, userId);
        break;
      }

      // Other events (invoice payment, etc.) can be handled here if needed
      default:
        // Ignore everything else for now
        break;
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }
}
