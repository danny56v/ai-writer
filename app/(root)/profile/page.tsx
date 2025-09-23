import React from "react";
import ManageSubscriptionButton from "@/components/ManageSubscriptionButton";

const Profile = () => {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/80 px-6 py-16 shadow-soft-xl backdrop-blur sm:px-10 lg:px-16">
      <div className="absolute -left-20 top-14 h-56 w-56 rounded-full bg-purple-400/25 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-24 bottom-16 h-60 w-60 rounded-full bg-fuchsia-400/25 blur-3xl" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),transparent_55%)]" aria-hidden="true" />
      <div className="relative mx-auto max-w-4xl">
        <div className="flex flex-col gap-6 text-center">
          <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-purple-200/70 bg-purple-50/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-purple-600">
            Account centre
          </span>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Manage billing, usage and workspace access</h1>
          <p className="text-base leading-7 text-slate-600">
            Keep your Aurora workspace aligned. Update payment methods, review invoices and adjust plan settings in one elegant hub.
          </p>
          <div className="grid gap-6 rounded-3xl border border-white/80 bg-white/80 p-8 shadow-soft-xl">
            <div className="grid gap-4 text-sm text-slate-600 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Plan status</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">Active</p>
              </div>
              <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Usage</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">Unlimited</p>
              </div>
              <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Billing cycle</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">Monthly</p>
              </div>
            </div>
            <div className="grid gap-4 text-sm sm:grid-cols-[minmax(0,0.6fr),minmax(0,0.4fr)] sm:text-left">
              <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-inner shadow-white/60 sm:flex-row sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Subscription controls</p>
                  <p className="mt-1 text-xs text-slate-500">Change plans, update seats or download invoices instantly.</p>
                </div>
                <ManageSubscriptionButton />
              </div>
              <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 text-left shadow-inner shadow-white/60">
                <p className="text-sm font-semibold text-slate-900">Need assistance?</p>
                <p className="mt-1 text-xs text-slate-500">
                  Email <span className="font-semibold text-slate-700">support@aurorastudio.ai</span> for help with billing or workspace access.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
