
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const rawBody = await new Response(req.body).text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error('⚠️  Webhook signature verification failed.', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const eventType = event.type;
  const data = event.data.object;

  switch (eventType) {
    case 'checkout.session.completed':
      console.log('✅ Checkout session completed:', data);
      break;

    case 'invoice.paid':
      console.log('💰 Invoice paid:', data);
      break;

    case 'invoice.payment_failed':
      console.log('❌ Invoice payment failed:', data);
      break;

    default:
      console.log(`Unhandled event type: ${eventType}`);
  }

  return NextResponse.json({ received: true });
}


// // // app/api/webhooks/stripe/route.ts

// // import { NextRequest, NextResponse } from 'next/server';
// // import { stripe } from '@/lib/stripe';
// // import Stripe from 'stripe';
// // // import { createOrUpdateCustomer, createOrUpdateSubscription } from '@/lib/mongo'; // funcțiile tale DB

// // const relevantEvents = new Set([
// //   'checkout.session.completed',
// //   'customer.subscription.created',
// //   'customer.subscription.updated',
// //   'customer.subscription.deleted',
// //   'invoice.paid',
// //   'invoice.payment_failed',
// // ]);

// // export async function POST(request: NextRequest) {
// //   const body = await request.text();
// //   const signature = request.headers.get('stripe-signature')!;

// //   let event: Stripe.Event;

// //   try {
// //     event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
// //   } catch (err) {
// //     console.error('Webhook signature verification failed.', err);
// //     return new NextResponse(`Webhook Error: ${err}`, { status: 400 });
// //   }

// //   const eventType = event.type;

// //   if (relevantEvents.has(eventType)) {
// //     try {
// //       switch (eventType) {
// //         case 'checkout.session.completed': {
// //           console.log('Checkout session completed:', event.data.object);
// //           // const session = event.data.object as Stripe.Checkout.Session;

// //           // if (session.mode === 'subscription') {
// //           //   const customerId = session.customer as string;
// //           //   const subscriptionId = session.subscription as string;

// //           //   // Salvezi clientul și subscriptionul
// //           //   await createOrUpdateCustomer(customerId);
// //           //   await createOrUpdateSubscription(subscriptionId);
// //           // }
// //           break;
// //         }

// //         case 'customer.subscription.created':{
// //           console.log('Subscription created:', event.data.object);
// //           break
// //         }
// //         case 'customer.subscription.updated': {
// //           console.log('Subscription updated:', event.data.object);
// //           // const subscription = event.data.object as Stripe.Subscription;
// //           // await createOrUpdateSubscription(subscription.id);
// //           break;
// //         }

// //         case 'customer.subscription.deleted': {
// //           // const subscription = event.data.object as Stripe.Subscription;
// //           // await deleteSubscription(subscription.id);
// //           break;
// //         }

// //         case 'invoice.paid': {
// //           // const invoice = event.data.object as Stripe.Invoice;
// //           // Poți actualiza statusul de plată în DB, dacă ai nevoie
// //           break;
// //         }

// //         case 'invoice.payment_failed': {
// //           // const invoice = event.data.object as Stripe.Invoice;
// //           // Marchezi că utilizatorul trebuie notificat
// //           break;
// //         }
// //       }
// //     } catch (error) {
// //       console.error('Error processing webhook event:', error);
// //       return new NextResponse('Webhook handler error', { status: 500 });
// //     }
// //   }

// //   return new NextResponse('Webhook received', { status: 200 });
// // }




// // Set your secret key. Remember to switch to your live secret key in production.
// // See your keys here: https://dashboard.stripe.com/apikeys

// import { NextRequest, NextResponse } from 'next/server';
// import { stripe } from '@/lib/stripe'; // ai stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
// import Stripe from 'stripe';

// export const config = {
//   api: {
//     bodyParser: false, // IMPORTANT pentru raw body
//   },
// };

// const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// export async function POST(req: NextRequest) {
//   const rawBody = await req.text(); // trebuie raw pentru semnătură
//   const signature = req.headers.get('stripe-signature')!;

//   let event: Stripe.Event;

//   try {
//     event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
//   } catch (err) {
//     console.error('⚠️  Webhook signature verification failed.', err);
//     return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
//   }

//   const eventType = event.type;
//   const data = event.data.object;

//   switch (eventType) {
//     case 'checkout.session.completed':
//       console.log('✅ Checkout session completed:', data);
//       // salvează userId, subscriptionId, customerId, etc.
//       break;

//     case 'invoice.paid':
//       console.log('💰 Invoice paid:', data);
//       // actualizează statusul abonamentului în DB
//       break;

//     case 'invoice.payment_failed':
//       console.log('❌ Invoice payment failed:', data);
//       // trimite notificare utilizatorului
//       break;

//     default:
//       console.log(`Unhandled event type: ${eventType}`);
//   }

//   return NextResponse.json({ received: true });
// }

// // // import Stripe from "stripe";
// // // import { stripe } from "@/lib/stripe";
// // // import { createOrUpdateSubscription } from "@/lib/mongo";
// // // import { NextRequest, NextResponse } from "next/server";

// // // export async function POST(req: NextRequest) {
// // //   const rawBody = await req.text();
// // //   const sig = req.headers.get("stripe-signature")!;

// // //   let event: Stripe.Event;

// // //   try {
// // //     event = stripe.webhooks.constructEvent(
// // //       rawBody,
// // //       sig,
// // //       process.env.STRIPE_WEBHOOK_SECRET!
// // //     );
// // //   } catch (err) {
// // //     console.error("Webhook error", err);
// // //     return NextResponse.json({ error: "Webhook invalid" }, { status: 400 });
// // //   }

// // //   const data = event.data.object;

// // //   if (
// // //     event.type === "checkout.session.completed" ||
// // //     event.type === "customer.subscription.updated" ||
// // //     event.type === "customer.subscription.deleted"
// // //   ) {
// // //     const sub: Stripe.Subscription =
// // //       event.type === "checkout.session.completed"
// // //         ? await stripe.subscriptions.retrieve(
// // //             (data as Stripe.Checkout.Session).subscription as string
// // //           )
// // //         : (data as Stripe.Subscription);

// // //     const customer = await stripe.customers.retrieve(sub.customer as string);
// // //     const email = (customer as Stripe.Customer).email!;

// // //     await createOrUpdateSubscription({
// // //       userEmail: email,
// // //       stripeSubscriptionId: sub.id,
// // //       status: sub.status,
// // //       priceId: sub.items.data[0].price.id,
// // //       currentPeriodEnd: new Date(sub.current_period_end * 1000),
// // //     });
// // //   }

// // //   return NextResponse.json({ received: true });
// // // }
