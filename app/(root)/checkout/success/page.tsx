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
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(203,186,255,0.28),transparent_60%),radial-gradient(circle_at_bottom,_rgba(255,183,229,0.25),transparent_55%)]" aria-hidden="true" />
          <div className="relative w-full max-w-lg overflow-hidden rounded-[2.75rem] border border-white/70 bg-white/90 p-10 text-center shadow-[0_35px_70px_-40px_rgba(34,7,94,0.22)] backdrop-blur">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#6b4dff] via-[#ff47c5] to-[#ffb347] shadow-[0_24px_44px_-22px_rgba(110,71,255,0.85)]">
              <CheckCircleIcon className="h-10 w-10 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-semibold text-[color:var(--foreground)]">Payment successful</h2>
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
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#6b4dff] via-[#ff47c5] to-[#ffb347] px-6 py-3 text-sm font-semibold text-white shadow-[0_24px_44px_-22px_rgba(110,71,255,0.85)] transition hover:opacity-95"
              >
                Start writing articles
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-[#d9cfff] bg-white/90 px-6 py-3 text-sm font-semibold text-slate-700 shadow-[inset_0_1px_10px_rgba(255,255,255,0.7)] transition hover:border-[#c2afff] hover:text-[#6b4dff]"
              >
                Go to dashboard
              </Link>
            </div>
            <p className="mt-6 text-xs text-slate-500">
              If you have any questions, contact{' '}
              <a href="mailto:support@example.com" className="font-semibold text-[#6b4dff]">
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
