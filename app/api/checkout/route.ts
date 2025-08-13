import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const ses = await auth();
    const user = ses?.user;
    const { priceId } = await request.json();

    if (!priceId || typeof priceId !== "string") {
      return NextResponse.json({ error: "Price ID is required" }, { status: 400 });
    }
    if (!user?.id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 401 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          // For usage-based billing, don't pass quantity
          quantity: 1,
        },
      ],
      // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
      // the actual Session ID is returned in the query parameter when your customer
      // is redirected to the success page.
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
      subscription_data: {},
      metadata: {
        userId: user.id,
      },
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error in checkout route:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}

// // app/api/checkout/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { stripe } from '@/lib/stripe';
// import { auth } from '@/auth';
// import { createOrUpdateCustomer } from '@/lib/mongo';

// export async function POST(request: NextRequest) {
//   try {
//     // 1. Verifică autentificarea
//     const session = await auth();
//     const user = session?.user;

//     if (!user?.id || !user?.email) {
//       return NextResponse.json(
//         { error: 'Authentication required' },
//         { status: 401 }
//       );
//     }

//     // 2. Preia priceId din body
//     const { priceId } = await request.json();
//     if (!priceId || typeof priceId !== 'string') {
//       return NextResponse.json(
//         { error: 'Price ID is required' },
//         { status: 400 }
//       );
//     }

//     // 3. Găsește sau creează clientul Stripe
//     let customer;
//     try {
//       const { data } = await stripe.customers.list({
//         email: user.email,
//         limit: 1
//       });

//       if (data.length > 0) {
//         customer = data[0];

//         // Asigură-te că metadata este sincronizată
//         if (customer.metadata?.userId !== user.id) {
//           await stripe.customers.update(customer.id, {
//             metadata: {
//               userId: user.id,
//               nextAuthId: user.id
//             }
//           });
//         }
//       } else {
//         customer = await stripe.customers.create({
//           email: user.email,
//           name: user.name || undefined,
//           metadata: {
//             userId: user.id,
//             nextAuthId: user.id
//           }
//         });

//         // Salvează în baza de date
//         await createOrUpdateCustomer({
//           userId: user.id,
//           userEmail: user.email,
//           stripeCustomerId: customer.id,
//           name: user.name || undefined,
//           image: user.image || undefined,
//           createdAt: new Date(),
//           updatedAt: new Date()
//         });
//       }
//     } catch (err) {
//       console.error('Error creating/updating Stripe customer:', err);
//       return NextResponse.json(
//         { error: 'Failed to create Stripe customer' },
//         { status: 500 }
//       );
//     }

//     // 4. Creează sesiunea Stripe Checkout
//     const checkoutSession = await stripe.checkout.sessions.create({
//       mode: 'subscription',
//       customer: customer.id,
//       payment_method_types: ['card'],
//       line_items: [
//         {
//           price: priceId,
//           quantity: 1,
//         },
//       ],
//       success_url: `${request.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${request.nextUrl.origin}/pricing`,
//       metadata: {
//         userId: user.id,
//         userEmail: user.email,
//         priceId
//       },
//       subscription_data: {
//         metadata: {
//           userId: user.id,
//           userEmail: user.email
//         }
//       },
//       automatic_tax: { enabled: true },
//       allow_promotion_codes: true,
//     });

//     return NextResponse.json({ url: checkoutSession.url });
//   } catch (error) {
//     console.error('Stripe checkout error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }
