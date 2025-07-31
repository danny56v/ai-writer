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
      // Extrage emailul în mod sigur
      const customerEmail = customer_details?.email
        
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="text-center">
                <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
                <h2 className="mt-4 text-2xl font-bold text-gray-900">
                  Payment Successful!
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Thank you for your purchase. Your subscription is now active.
                </p>
                
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900">Order Details</h3>
                  {customerEmail && (
                    <p className="mt-1 text-sm text-gray-600">
                      Confirmation email sent to: <strong>{customerEmail}</strong>
                    </p>
                  )}
                  {subscription && (
                    <p className="mt-1 text-sm text-gray-600">
                      Subscription ID: <code className="text-xs bg-gray-200 px-1 py-0.5 rounded">{typeof subscription === 'string' ? subscription : subscription.id}</code>
                    </p>
                  )}
                </div>

                <div className="mt-6 space-y-3">
                  <Link
                    href="/article-writer"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Start Writing Articles
                  </Link>
                  <Link
                    href="/"
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Go to Dashboard
                  </Link>
                </div>

                <p className="mt-4 text-xs text-gray-500">
                  If you have any questions, please contact{' '}
                  <a href="mailto:support@example.com" className="text-indigo-600 hover:text-indigo-500">
                    support@example.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  } catch (error) {
    console.error('Error retrieving checkout session:', error)
    return redirect('/pricing')
  }
}