'use client'

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import { fetchClientSecret } from '@/lib/actions/stripe'

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
if (!stripePublishableKey) {
  throw new Error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable')
}

const stripePromise = loadStripe(stripePublishableKey)

export default function Checkout() {
  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ fetchClientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}