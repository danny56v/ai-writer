// "use server";

// import { headers } from "next/headers";

// import { stripe } from "@/lib/stripe";

// const PRICE_IDS = {
//   pro_monthly: "price_1RqYGERsRyFq7mSBRUl2pfnl", // $14.99/month
//   pro_yearly: "price_1RqYhgRsRyFq7mSBmL9rimXh", // $149.99/year
//   unlimited_monthly: "price_1RqYmXRsRyFq7mSBLFPa9xoC", // $49.99/month (unlimited)
//   unlimited_yearly: "price_1RqYn5RsRyFq7mSBm7j1RBMZ", // $499.99/year (unlimited)
// };
// export async function fetchClientSecret() {
//   const origin = (await headers()).get("origin");

//   // Create Checkout Sessions from body params.
//   const session = await stripe.checkout.sessions.create({
//     ui_mode: "embedded",
//     line_items: [
//       {
//         price: PRICE_IDS.pro_monthly,
//         quantity: 1,
//       },
//       {
//         price: PRICE_IDS.pro_yearly,
//         quantity: 1,
//       },
//       {
//         price: PRICE_IDS.unlimited_monthly,
//         quantity: 1,
//       },
//       {
//         price: PRICE_IDS.unlimited_yearly,
//         quantity: 1,
//       },
//     ],
//     mode: "payment",
//     return_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
//     automatic_tax: { enabled: true },
//   });

//   return session.client_secret;
// }
