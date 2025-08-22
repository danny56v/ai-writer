// app/subscription/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserSubscriptionWithPlan, getArticleLimits, hasFeatureAccess } from "@/lib/subscription-helpers";
import Link from "next/link";

export default async function SubscriptionPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const subscriptionData = await getUserSubscriptionWithPlan(session.user.id);
  const articleLimits = await getArticleLimits(session.user.id);
  const hasAPIAccess = await hasFeatureAccess(session.user.id, 'api_access');
  const hasBulkGeneration = await hasFeatureAccess(session.user.id, 'bulk_generation');

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800", 
      failed: "bg-red-100 text-red-800",
      canceled: "bg-gray-100 text-gray-800"
    };
    
    return statusClasses[status as keyof typeof statusClasses] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your subscription, billing, and account settings.
            </p>
          </div>

          <div className="p-6">
            {!subscriptionData ? (
              // No active subscription
              <div className="text-center py-8">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 48 48">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.712-3.714M14 40v-4a9.971 9.971 0 01.712-3.714M14 40v-4a6 6 0 0110.712-3.714"
                    />
                  </svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No active subscription</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You are currently on the free plan with limited features.
                </p>
                <div className="mt-6">
                  <Link
                    href="/pricing"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Upgrade to Pro
                  </Link>
                </div>
              </div>
            ) : (
              // Active subscription
              <div className="space-y-6">
                {/* Current Plan */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {subscriptionData.plan.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {subscriptionData.plan.price} per {subscriptionData.plan.interval}
                      </p>
                    </div>
                    <div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(subscriptionData.status)}`}>
                        {subscriptionData.status.charAt(0).toUpperCase() + subscriptionData.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Usage & Limits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900">Article Generation</h4>
                    <p className="mt-1 text-sm text-gray-600">
                      {articleLimits.hasUnlimited ? (
                        <span className="text-green-600 font-medium">Unlimited articles</span>
                      ) : (
                        <span>Up to {articleLimits.monthlyLimit} articles per month</span>
                      )}
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900">API Access</h4>
                    <p className="mt-1 text-sm text-gray-600">
                      {hasAPIAccess ? (
                        <span className="text-green-600 font-medium">✓ Enabled</span>
                      ) : (
                        <span className="text-gray-500">Not available</span>
                      )}
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900">Bulk Generation</h4>
                    <p className="mt-1 text-sm text-gray-600">
                      {hasBulkGeneration ? (
                        <span className="text-green-600 font-medium">✓ Enabled</span>
                      ) : (
                        <span className="text-gray-500">Not available</span>
                      )}
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900">Support</h4>
                    <p className="mt-1 text-sm text-gray-600">
                      <span className="text-green-600 font-medium">✓ Priority Support</span>
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <form action="/api/billing/portal" method="GET" className="flex-1">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Manage Billing
                    </button>
                  </form>

                  <Link
                    href="/pricing"
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Change Plan
                  </Link>
                </div>

                {/* Subscription Details */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Subscription Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Subscription ID:</span>
                      <p className="font-mono text-xs mt-1 break-all">{subscriptionData.subscriptionId}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Customer ID:</span>
                      <p className="font-mono text-xs mt-1 break-all">{subscriptionData.customerId}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Created:</span>
                      <p className="mt-1">{new Date(subscriptionData.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Last Updated:</span>
                      <p className="mt-1">{new Date(subscriptionData.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/article-writer"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Create Article</p>
                <p className="text-sm text-gray-500">Generate new content</p>
              </div>
            </Link>

            <Link
              href="/pricing"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">View Plans</p>
                <p className="text-sm text-gray-500">Compare all options</p>
              </div>
            </Link>

            <a
              href="mailto:support@yourapp.com"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Get Support</p>
                <p className="text-sm text-gray-500">Contact our team</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}