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

/** Alege itemul de plan relevant (de obicei ai unul). */
function pickPlanItem(sub: Stripe.Subscription) {
  const items = sub.items?.data ?? [];
  return items[0]; // dacă ai mai multe prețuri, implementează o regulă aici
}

/** Găsește userId-ul tău din informațiile Stripe (customerId → users.stripeCustomerId → email → metadata.userId). */
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

/** Upsert Subscription în Mongo, citind perioadele de pe ITEM (Basil). */
async function upsertSubscription(sub: Stripe.Subscription, userId?: string | null) {
  const d = await db();
  const item = pickPlanItem(sub);
  const priceId = item?.price?.id ?? null;

  // Perioada curentă (Basil: pe item). Fallback minimal pt. compat.
  const currentPeriodStart = toDate(item?.current_period_start) ?? toDate(sub.start_date);
  const currentPeriodEnd = toDate(item?.current_period_end) ?? undefined;

  await d.collection("subscriptions").updateOne(
    { stripeSubscriptionId: sub.id },
    {
      $set: {
        ...(userId ? { userId } : {}),
        stripePriceId: priceId,
        status: sub.status, // exact cum vine din Stripe
        planType: planFromPrice(priceId ?? undefined), // "free" fallback dacă nu găsește
        currentPeriodStart: currentPeriodStart ?? new Date(),
        currentPeriodEnd: currentPeriodEnd ?? new Date(),
        cancelAtPeriodEnd: sub.cancel_at_period_end ?? false,
        // câmpuri utile pentru UI/debug
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
      // 1) După checkout reușit: setează users.stripeCustomerId (dacă lipsește) + upsert subscription
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;

        const stripeCustomerId = (s.customer as string) || null;
        const stripeSubscriptionId = (s.subscription as string) || null;

        // încearcă să ai un email
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

        // atașează stripeCustomerId pe user dacă lipsea
        if (userId && stripeCustomerId) {
          await d
            .collection("users")
            .updateOne({ _id: new ObjectId(userId) }, { $set: { stripeCustomerId, updatedAt: new Date() } });
        }

        // sincronizează sub-ul
        if (stripeSubscriptionId) {
          const sub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
          await upsertSubscription(sub, userId);
        }
        break;
      }

      // 2) Lifecycle subscription: created/updated/deleted → upsert
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

      // (opțional) invoice.payment_succeeded/failed → poți salva facturi/alerts
      default:
        // ignoră restul evenimentelor
        break;
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }
}
