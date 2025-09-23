import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { stripe } from '@/lib/stripe'

export default async function Return({ searchParams }: { searchParams: { session_id?: string } }) {
  const { session_id } = await searchParams

  if (!session_id) {
    return redirect('/pricing')
  }

  try {
    const {
      status,
      customer_details,
      subscription
    } = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items', 'subscription']
    })

    if (status === 'open') {
      return redirect('/pricing')
    }

    if (status === 'complete') {
      const customerEmail = customer_details?.email

      return (
        <section className="relative mt-16 flex min-h-[70vh] items-center justify-center px-4">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.2),transparent_60%),radial-gradient(circle_at_bottom,_rgba(244,114,182,0.2),transparent_55%)]" aria-hidden="true" />
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/80 bg-white/80 p-10 text-center shadow-soft-xl backdrop-blur">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-amber-400 shadow-lg shadow-fuchsia-400/40">
              <CheckCircleIcon className="h-10 w-10 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-semibold text-slate-900">Payment successful</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Thank you for your purchase. Your subscription is now active.
            </p>
            <div className="mt-8 space-y-3 text-sm text-slate-600">
              {customerEmail && (
                <p>
                  Confirmation email sent to <span className="font-semibold text-slate-900">{customerEmail}</span>
                </p>
              )}
              {subscription && (
                <p>
                  Subscription ID:{' '}
                  <code className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                    {typeof subscription === 'string' ? subscription : subscription.id}
                  </code>
                </p>
              )}
            </div>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/article-writer"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-amber-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-400/40 transition hover:opacity-95"
              >
                Start writing articles
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 shadow-inner shadow-white/60 transition hover:border-purple-200 hover:text-purple-600"
              >
                Go to dashboard
              </Link>
            </div>
            <p className="mt-6 text-xs text-slate-500">
              If you have any questions, contact{' '}
              <a href="mailto:support@example.com" className="font-semibold text-purple-600">
                support@example.com
              </a>
            </p>
          </div>
        </section>
      )
    }
  } catch (error) {
    console.error('Error retrieving checkout session:', error)
    return redirect('/pricing')
  }
}
