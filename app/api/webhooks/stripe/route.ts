// app/api/webhooks/stripe/route.ts

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

import { createOrUpdateCustomer, getUserIdByCustomerId } from "@/lib/mongo";
import { createOrUpdateSubscription } from "@/lib/mongo";

type InvoiceWithSubscription = Stripe.Invoice & {
  subscription?: string | null;
};
type InvoiceLineItemWithPrice = Stripe.InvoiceLineItem & {
  price?: Stripe.Price;
};

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
 const rawBody = await req.text();

  const signature = req.headers.get("stripe-signature")!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("⚠️ Invalid Stripe signature:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const data = event.data.object;
  const eventType = event.type;

  try {
    switch (eventType) {
      case "checkout.session.completed": {
        const session = data as Stripe.Checkout.Session;
        console.log("✅ Processing checkout completion...");
        
        // 1. Salvează clientul Stripe + userId în colecția customers
        if (session.customer && session.customer_email && session.metadata?.userId) {
          await createOrUpdateCustomer({
            userId: session.metadata.userId,
            customerId: session.customer.toString(),
            email: session.customer_email,
          });
        }

        // 2. Pentru subscription, obține datele complete de la Stripe
        if (session.subscription && session.metadata?.userId && session.customer) {
          // Obține subscription-ul complet pentru a avea priceId
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription.toString()
          );

          await createOrUpdateSubscription({
            userId: session.metadata.userId,
            customerId: session.customer.toString(),
            subscriptionId: subscription.id,
            priceId: subscription.items.data[0].price.id, // ✅ Acum ai priceId direct
            status: subscription.status as "pending" | "active" | "failed",
            createdAt: new Date(subscription.created * 1000),
            updatedAt: new Date(),
          });

          console.log(`✅ Subscription created with priceId: ${subscription.items.data[0].price.id}`);
        }
        
        console.log(`✅ Checkout completed for user ${session.metadata?.userId}`);
        break;
      }

case "customer.subscription.created":{
        const subscription = data as Stripe.Subscription;
        console.log(`📦 Processing new subscription:`, subscription.id);
        
        const userId = await getUserIdByCustomerId(subscription.customer.toString());

        if (!userId) {
          console.warn("❌ User not found for customer:", subscription.customer);
          break;
        }

        // Salvează subscription-ul în baza de date
        await createOrUpdateSubscription({
          userId,
          customerId: subscription.customer.toString(),
          subscriptionId: subscription.id,
          priceId: subscription.items.data[0].price.id,
          status: subscription.status as "pending" | "active" | "failed",
          createdAt: new Date(subscription.created * 1000),
          updatedAt: new Date(),
        });
        
        console.log(`✅ Subscription created for user ${userId}`);
        break;  
}

      case "customer.subscription.updated": {
        const subscription = data as Stripe.Subscription;
        console.log(`🔄 Processing subscription update:`, subscription.id);
        
        const userId = await getUserIdByCustomerId(subscription.customer.toString());

        if (!userId) {
          console.warn("❌ User not found for customer:", subscription.customer);
          break;
        }

        // Actualizează subscription-ul cu noile date
        await createOrUpdateSubscription({
          userId,
          customerId: subscription.customer.toString(),
          subscriptionId: subscription.id,
          priceId: subscription.items.data[0].price.id,
          status: subscription.status as "pending" | "active" | "failed",
          createdAt: new Date(subscription.created * 1000),
          updatedAt: new Date(),
        });
        
        console.log(`✅ Subscription updated for user ${userId}`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = data as Stripe.Subscription;
        console.log("🗑️ Processing subscription deletion:", subscription.id);

        const userId = await getUserIdByCustomerId(subscription.customer.toString());

        if (!userId) {
          console.warn("❌ User not found for customer:", subscription.customer);
          break;
        }

        await createOrUpdateSubscription({
          userId,
          customerId: subscription.customer.toString(),
          subscriptionId: subscription.id,
          priceId: subscription.items.data[0].price.id,
          status: "canceled",
          createdAt: new Date(subscription.created * 1000),
          updatedAt: new Date(),
        });
        
        console.log(`✅ Subscription canceled for user ${userId}`);
        break;
      }

      case "invoice.paid": {
        const invoice = data as InvoiceWithSubscription;
        console.log("💰 Processing invoice payment:", invoice.id);

        if (!invoice.customer) {
          console.warn("❌ Invoice customer is null");
          break;
        }

        if (!invoice.subscription) {
          console.warn("❌ Invoice does not have a subscription ID, skipping...");
          break;
        }

        const subscriptionId = invoice.subscription.toString();
        const lineItem = invoice.lines.data[0] as InvoiceLineItemWithPrice;

        if (!lineItem?.price) {
          console.warn("❌ Invoice line item price is missing");
          break;
        }

        const userId = await getUserIdByCustomerId(invoice.customer.toString());
        if (!userId) {
          console.warn("❌ User not found for customer:", invoice.customer);
          break;
        }

        await createOrUpdateSubscription({
          userId,
          customerId: invoice.customer.toString(),
          subscriptionId,
          priceId: lineItem.price.id,
          status: "active", // 🎯 Plata reușită = subscription activ
          createdAt: new Date(invoice.created * 1000),
          updatedAt: new Date(),
        });

        console.log(`✅ Invoice paid - subscription activated for user ${userId}`);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = data as InvoiceWithSubscription;
        console.log("❌ Processing failed payment:", invoice.id);

        if (!invoice.customer) {
          console.warn("❌ Invoice customer is null");
          break;
        }

        const subscriptionId = invoice.subscription?.toString();

        if (!subscriptionId) {
          console.warn("❌ Invoice does not have a subscription ID");
          break;
        }

        const lineItem = invoice.lines.data[0] as InvoiceLineItemWithPrice;

        if (!lineItem.price) {
          console.warn("❌ Invoice line item price is missing");
          break;
        }

        const userId = await getUserIdByCustomerId(invoice.customer.toString());

        if (!userId) {
          console.warn("❌ User not found for customer:", invoice.customer);
          break;
        }

        await createOrUpdateSubscription({
          userId,
          customerId: invoice.customer.toString(),
          subscriptionId,
          priceId: lineItem.price.id,
          status: "failed",
          createdAt: new Date(invoice.created * 1000),
          updatedAt: new Date(),
        });
        
        console.log(`❌ Payment failed for user ${userId}`);
        break;
      }

      default:
        console.log(`ℹ️ Unhandled Stripe event: ${eventType}`);
    }
  } catch (error) {
    console.error(`❌ Error processing webhook ${eventType}:`, error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}