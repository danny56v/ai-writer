import { auth } from "@/auth";
import ManageSubscriptionButton from "@/components/ManageSubscriptionButton";
import ResetPasswordModal from "@/components/ResetPasswordModal";
import LogoutButton from "@/components/LogoutButton";
import ChangeEmailModal from "@/components/ChangeEmailModal";
import ChangeNameModal from "@/components/ChangeNameModal";
import BillingHistory from "@/components/profile/BillingHistory";
import { getUserPlan } from "@/lib/billing";
import {
  BellIcon,
  CreditCardIcon,
  CubeIcon,
  FingerPrintIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { redirect } from "next/navigation";
import Link from "next/link";

const secondaryNavigation = [
  { id: "profile", name: "Profile", icon: UserCircleIcon },
  { id: "notifications", name: "Notifications", icon: BellIcon },
  { id: "plan", name: "Plan", icon: CubeIcon },
  { id: "billing", name: "Billing", icon: CreditCardIcon },
  { id: "security", name: "Security", icon: FingerPrintIcon },
];

const planLabels: Record<string, string> = {
  free: "Free",
  pro_monthly: "Pro (Monthly)",
  pro_yearly: "Pro (Yearly)",
  unlimited_monthly: "Unlimited (Monthly)",
  unlimited_yearly: "Unlimited (Yearly)",
};

const statusLabels: Record<string, string> = {
  trialing: "Trialing",
  active: "Active",
  past_due: "Past due",
  canceled: "Canceled",
  incomplete: "Incomplete",
  incomplete_expired: "Incomplete expired",
  unpaid: "Unpaid",
  paused: "Paused",
  inactive: "Inactive",
  free: "Free tier",
};

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function formatDate(date: Date | null) {
  if (!date) {
    return "Not set";
  }
  try {
    return new Intl.DateTimeFormat("en", {
      dateStyle: "long",
    }).format(date);
  } catch {
    return date.toString();
  }
}

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const user = session.user as typeof session.user & {
    hasPassword?: boolean;
    hasGoogleAccount?: boolean;
    canChangeEmail?: boolean;
    emailVerified?: Date | null;
    name?: string | null;
  };
  const { planType, status, currentPeriodEnd } = await getUserPlan(user.id);

  const planName = planLabels[planType] ?? "Free";
  const statusName = statusLabels[status] ?? status;
  const isFreePlan = planType === "free";
  const hasPassword = !!user.hasPassword;
  const hasGoogleAccount = !!user.hasGoogleAccount;
  const canChangeEmail = !!user.canChangeEmail;
  const emailVerified = user.emailVerified ?? null;
  const displayName = user.name ?? "No name added";
  const customerId = session.user.stripeCustomerId ?? null;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-32 pb-16 sm:px-6 lg:flex lg:gap-x-16 lg:px-8">
      <aside className="flex overflow-x-auto border-b border-gray-200 pb-4 lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] lg:w-64 lg:flex-none lg:border-0 lg:pb-0">
        <nav className="flex-none px-2 sm:px-0 lg:px-0">
          <ul role="list" className="flex gap-2 whitespace-nowrap text-sm font-semibold text-gray-600 lg:flex-col">
            {secondaryNavigation.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="group flex items-center gap-3 rounded-md px-3 py-2 transition hover:bg-gray-50 hover:text-indigo-600"
                >
                  <item.icon
                    aria-hidden="true"
                    className="h-5 w-5 text-gray-400 transition group-hover:text-indigo-600"
                  />
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="flex-auto py-12 lg:py-0">
        <div className="mx-auto max-w-2xl space-y-16 lg:mx-0 lg:max-w-none">
          <section id="profile">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              Basic details tied to your ScriptNest account.
            </p>

            <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
              <div className="pt-6 sm:flex">
                <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Full name</dt>
                <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                  <div className="text-gray-900">{displayName}</div>
                  <ChangeNameModal currentName={displayName === "No name added" ? "" : displayName} />
                </dd>
              </div>
              <div className="pt-6 sm:flex">
                <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Email address</dt>
                <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                  <div className="text-gray-900">{user.email}</div>
                  {canChangeEmail ? (
                    <ChangeEmailModal currentEmail={user.email ?? ""} />
                  ) : (
                    <span className="text-sm text-gray-400">
                      {hasGoogleAccount
                        ? "Email managed via Google sign-in"
                        : "Email updates unavailable"}
                    </span>
                  )}
                </dd>
              </div>
              {!emailVerified && !hasGoogleAccount && (
                <div className="pt-6 text-sm text-amber-600">
                  Your email is awaiting verification. Check your inbox for the latest confirmation link.
                </div>
              )}
            </dl>
          </section>

          <section id="notifications">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Notifications</h2>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              Control when ScriptNest reaches out and what updates you receive.
            </p>

            <div className="mt-6 space-y-4 text-sm leading-6">
              <div className="flex items-start justify-between gap-x-6 rounded-lg border border-gray-200 p-6">
                <div>
                  <p className="font-medium text-gray-900">Product announcements</p>
                  <p className="text-gray-500">Hear about new features and workflow tips.</p>
                </div>
                <span className="text-indigo-600">Enabled</span>
              </div>
              <div className="flex items-start justify-between gap-x-6 rounded-lg border border-gray-200 p-6">
                <div>
                  <p className="font-medium text-gray-900">Usage updates</p>
                  <p className="text-gray-500">Receive reminders when you approach your monthly limits.</p>
                </div>
                <span className="text-gray-400">Coming soon</span>
              </div>
            </div>
          </section>

          <section id="plan">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Plan</h2>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              Review your current subscription and manage renewals.
            </p>

            <div className="mt-6 space-y-6 rounded-lg border border-gray-200 p-6 text-sm leading-6">
              <div className="flex flex-wrap items-center justify-between gap-y-2">
                <div>
                  <p className="text-gray-500">Active plan</p>
                  <p className="text-base font-semibold text-gray-900">{planName}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500">Status</p>
                  <p className={classNames("text-base font-semibold", status === "active" ? "text-emerald-600" : "text-gray-900")}>{statusName}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-y-2">
                <div>
                  <p className="text-gray-500">Renews on</p>
                  <p className="text-base font-semibold text-gray-900">{formatDate(currentPeriodEnd)}</p>
                </div>
                {!isFreePlan && (
                  <div className="text-right">
                    <p className="text-gray-500">Need a different plan?</p>
                    <Link
                      href="/pricing"
                      className="text-base font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Explore pricing
                    </Link>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-500">
                  {isFreePlan
                    ? "Review available plans to unlock more features."
                    : "Open the Stripe customer portal to update payment methods or cancel."}
                </p>
                {isFreePlan ? (
                  <Link
                    href="/pricing"
                    className="inline-flex items-center justify-center rounded-md border border-indigo-600 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
                  >
                    View plans
                  </Link>
                ) : (
                  <ManageSubscriptionButton />
                )}
              </div>
            </div>
          </section>

          <section id="billing">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Billing</h2>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              Keep your payment information current to avoid interruptions.
            </p>

            <div className="mt-6 space-y-6">
              {/* <div className="rounded-lg border border-gray-200 p-6 text-sm leading-6 text-gray-500">
                Billing history will appear here after your first invoice. In the meantime you can manage your
                subscription and update cards through the customer portal.
              </div> */}

              <BillingHistory customerId={customerId} />
            </div>
          </section>
             <section id="security">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Security</h2>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              Manage how you sign in and keep your account protected.
            </p>

            <div className="mt-6 rounded-lg border border-gray-200 p-6 text-sm leading-6">
              <div className="flex items-center justify-between gap-x-6">
                <div>
                  <p className="font-medium text-gray-900">Password</p>
                  <p className="text-gray-500">Reset your password and keep it unique.</p>
                </div>
                {hasPassword ? (
                  <ResetPasswordModal />
                ) : (
                  <span className="text-sm text-gray-400">Managed via Google sign-in</span>
                )}
              </div>
              <div className="mt-6 flex items-center justify-between gap-x-6 border-t border-gray-100 pt-6">
                <div>
                  <p className="font-medium text-gray-900">Log out</p>
                  <p className="text-gray-500">End your current session securely.</p>
                </div>
                <LogoutButton />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
