import type { Metadata } from "next";

import { auth } from "@/auth";
import ManageSubscriptionButton from "@/components/ManageSubscriptionButton";
import ResetPasswordModal from "@/components/ResetPasswordModal";
import LogoutButton from "@/components/LogoutButton";
import ChangeEmailModal from "@/components/ChangeEmailModal";
import ChangeNameModal from "@/components/ChangeNameModal";
import BillingHistory from "@/components/profile/BillingHistory";
import { getUserPlan } from "@/lib/billing";
import { db } from "@/lib/db";
import type { PlanKey } from "@/lib/plans";
import { ObjectId } from "mongodb";
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

export const metadata: Metadata = {
  title: "ListologyAi Account Hub",
  description:
    "Optimize your ListologyAi workspace, plan usage, billing history, and security settings from one dashboard.",
  keywords: [
    "ListologyAi account",
    "real estate AI billing",
    "ListologyAi subscription management",
  ],
  openGraph: {
    title: "ListologyAi Account Hub",
    description:
      "Review ListologyAi profile details, usage analytics, billing history, and security preferences in one place.",
    url: "https://listologyai.com/profile",
    type: "website",
    images: [
      {
        url: "/Logo.png",
        width: 800,
        height: 800,
        alt: "ListologyAi account dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ListologyAi Account Hub",
    description:
      "Access ListologyAi account controls, billing tools, and security settings from a single hub.",
    images: ["/Logo.png"],
  },
  robots: {
    index: false,
    follow: false,
  },
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

function daysInUtcMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

function clampAnchorDay(anchorDay: number, year: number, month: number) {
  return Math.min(Math.max(anchorDay, 1), daysInUtcMonth(year, month));
}

function computeMonthlyPeriodStart(anchorDay: number, reference: Date) {
  const year = reference.getUTCFullYear();
  const month = reference.getUTCMonth();
  const dayThisMonth = clampAnchorDay(anchorDay, year, month);
  let start = new Date(Date.UTC(year, month, dayThisMonth));

  if (reference < start) {
    const prevMonth = month - 1;
    const prevYear = prevMonth < 0 ? year - 1 : year;
    const normalizedPrevMonth = (prevMonth + 12) % 12;
    const dayPrev = clampAnchorDay(anchorDay, prevYear, normalizedPrevMonth);
    start = new Date(Date.UTC(prevYear, normalizedPrevMonth, dayPrev));
  }

  return start;
}

export default async function ProfilePage() {
  const session = await auth();
  const baseUser = session?.user;

  if (!baseUser?.id) {
    redirect("/sign-in");
  }

  const user = baseUser as typeof baseUser & {
    hasPassword?: boolean;
    hasGoogleAccount?: boolean;
    canChangeEmail?: boolean;
    emailVerified?: Date | null;
    name?: string | null;
    id: string;
    stripeCustomerId?: string | null;
  };
  const { planType, status, currentPeriodEnd } = await getUserPlan(user.id);

  const REAL_ESTATE_LIMITS: Record<PlanKey, number | null> = {
    free: 1,
    pro_monthly: 50,
    pro_yearly: 50,
    unlimited_monthly: 1500,
    unlimited_yearly: 1500,
  };

  const database = await db();
  type RealEstateUsageDocument = {
    usage?: {
      realEstate?: {
        planType?: string;
        limit?: number | null;
        used?: number | null;
        periodKey?: string | null;
        updatedAt?: Date | null;
      };
    };
  };
  const usersCollection = database.collection<RealEstateUsageDocument>("users");

  let usageDoc: RealEstateUsageDocument | null = null;

  try {
    usageDoc = await usersCollection.findOne(
      { _id: new ObjectId(user.id) },
      { projection: { "usage.realEstate": 1 } }
    );
  } catch (error) {
    console.error("Failed to load usage for profile", error);
  }

  const realEstateUsage = usageDoc?.usage?.realEstate;
  const usageMatchesPlan = realEstateUsage?.planType === planType;
  const planLimit = REAL_ESTATE_LIMITS[planType as PlanKey] ?? null;
  const usedGenerations = usageMatchesPlan && typeof realEstateUsage?.used === "number" ? realEstateUsage.used : 0;
  const remainingGenerations = planLimit === null ? null : Math.max(planLimit - usedGenerations, 0);
  const usageProgress = planLimit && planLimit > 0 ? Math.min((usedGenerations / planLimit) * 100, 100) : 0;

  let anchorDay: number | null = null;
  if (usageMatchesPlan && typeof realEstateUsage?.periodKey === "string") {
    const prefix = `${planType}-`;
    if (realEstateUsage.periodKey.startsWith(prefix)) {
      const datePart = realEstateUsage.periodKey.slice(prefix.length);
      const parsed = new Date(`${datePart}T00:00:00.000Z`);
      if (!Number.isNaN(parsed.getTime())) {
        anchorDay = parsed.getUTCDate();
      }
    }
  }
  if (anchorDay === null && currentPeriodEnd) {
    const anchorSource = new Date(currentPeriodEnd);
    if (!Number.isNaN(anchorSource.getTime())) {
      anchorDay = anchorSource.getUTCDate();
    }
  }
  if (anchorDay === null) {
    anchorDay = new Date().getUTCDate();
  }

  let usageRenewsAt: Date | null = null;
  if (planLimit === null) {
    usageRenewsAt = currentPeriodEnd ?? null;
  } else if (planType === "free") {
    const now = new Date();
    usageRenewsAt = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  } else if (planType === "unlimited_monthly" || planType === "unlimited_yearly") {
    const now = new Date();
    const periodStart = computeMonthlyPeriodStart(anchorDay, now);
    const nextMonth = periodStart.getUTCMonth() + 1;
    const nextYear = periodStart.getUTCFullYear() + Math.floor(nextMonth / 12);
    const normalizedMonth = (nextMonth + 12) % 12;
    const nextDay = clampAnchorDay(anchorDay, nextYear, normalizedMonth);
    usageRenewsAt = new Date(Date.UTC(nextYear, normalizedMonth, nextDay));
  } else if (currentPeriodEnd) {
    usageRenewsAt = currentPeriodEnd;
  } else if (usageMatchesPlan && realEstateUsage?.periodKey) {
    const prefix = `${planType}-`;
    if (realEstateUsage.periodKey.startsWith(prefix)) {
      const iso = realEstateUsage.periodKey.slice(prefix.length);
      const parsed = new Date(iso);
      if (!Number.isNaN(parsed.getTime())) {
        usageRenewsAt = parsed;
      }
    }
  }

  const planName = planLabels[planType] ?? "Free";
  const statusName = statusLabels[status] ?? status;
  const isFreePlan = planType === "free";
  const hasPassword = !!user.hasPassword;
  const hasGoogleAccount = !!user.hasGoogleAccount;
  const canChangeEmail = !!user.canChangeEmail;
  const emailVerified = user.emailVerified ?? null;
  const displayName = user.name ?? "No name added";
  const customerId = user.stripeCustomerId ?? null;

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
              Basic details tied to your ListologyAi account.
            </p>

            <div className="mt-6 space-y-4 text-sm leading-6">
              <div className="flex flex-col gap-4 rounded-lg border border-gray-200 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-gray-900">Full name</p>
                  <p className="text-gray-900 font-bold">{displayName}</p>
                </div>
                <ChangeNameModal currentName={displayName === "No name added" ? "" : displayName} />
              </div>
              <div className="flex flex-col gap-4 rounded-lg border border-gray-200 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-gray-900">Email address</p>
                  <p className="text-gray-900 font-bold">{user.email}</p>
                </div>
                {canChangeEmail ? (
                  <ChangeEmailModal currentEmail={user.email ?? ""} />
                ) : (
                  <span className="text-sm text-gray-400">
                    {hasGoogleAccount
                      ? "Email managed via Google sign-in"
                      : "Email updates unavailable"}
                  </span>
                )}
              </div>
              {!emailVerified && !hasGoogleAccount && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                  Your email is awaiting verification. Check your inbox for the latest confirmation link.
                </div>
              )}
            </div>
          </section>

          <section id="notifications">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Notifications</h2>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              Control when ListologyAi reaches out and what updates you receive.
            </p>

            <div className="mt-6 space-y-4 text-sm leading-6">
              <div className="flex items-start justify-between gap-x-6 rounded-lg border border-gray-200 p-6">
                <div>
                  <p className="font-medium text-gray-900">Product announcements</p>
                  <p className="text-gray-500">Hear about new features and workflow tips.</p>
                </div>
                <span className="text-gray-400">Coming Soon</span>
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
              <div className="rounded-lg border border-indigo-100 bg-indigo-50/60 p-5 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
                      Real estate generations
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {planLimit === null
                        ? "Unlimited"
                        : `${remainingGenerations ?? 0} remaining`}
                    </p>
                    <p className="text-xs text-indigo-500">
                      {planLimit === null
                        ? "Unlimited generations included in your plan"
                        : `${usedGenerations} used out of ${planLimit}`}
                    </p>
                  </div>
                  {planLimit !== null && (
                    <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-indigo-600 shadow-sm">
                      {usedGenerations}/{planLimit}
                    </span>
                  )}
                </div>
                {planLimit !== null && (
                  <div className="mt-4 h-2 w-full rounded-full bg-indigo-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-indigo-500 to-purple-500"
                      style={{ width: `${usageProgress}%` }}
                      aria-hidden
                    />
                  </div>
                )}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-indigo-500">
                  <span className="font-medium">
                    {planLimit === null
                      ? "No monthly cap"
                      : `${remainingGenerations ?? 0} generation${remainingGenerations === 1 ? "" : "s"} left`}
                  </span>
                  {usageRenewsAt ? (
                    <span>Resets on {formatDate(usageRenewsAt)}</span>
                  ) : null}
                </div>
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
