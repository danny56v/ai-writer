import React from "react";
import ManageSubscriptionButton from "@/components/ManageSubscriptionButton";

const Profile = () => {
  return (
    <section className="relative overflow-hidden rounded-[3.25rem] border border-white/70 bg-gradient-to-br from-[#ffffff]/95 via-[#f6f0ff]/95 to-[#fff1fb]/95 px-6 py-16 shadow-soft-xl backdrop-blur sm:px-10 lg:px-16">
      <div className="absolute -left-24 top-14 h-56 w-56 rounded-full bg-gradient-to-br from-[#c4b0ff]/45 via-[#ff92d7]/35 to-transparent blur-3xl" aria-hidden="true" />
      <div className="absolute -right-28 bottom-16 h-60 w-60 rounded-full bg-gradient-to-br from-[#ffc87f]/45 via-[#ff80cc]/35 to-transparent blur-3xl" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),transparent_55%)]" aria-hidden="true" />
      <div className="relative mx-auto max-w-4xl">
        <div className="flex flex-col gap-6 text-center">
          <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#d9cfff] bg-[#f3ecff] px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#6b4dff]">
            Account centre
          </span>
          <h1 className="text-3xl font-semibold text-[color:var(--foreground)] sm:text-4xl">Manage billing, usage and workspace access</h1>
          <p className="text-base leading-7 text-slate-600">
            Keep your Aurora workspace aligned. Update payment methods, review invoices and adjust plan settings in one elegant hub.
          </p>
          <div className="grid gap-6 rounded-[2.75rem] border border-white/70 bg-white/90 p-8 shadow-[0_35px_70px_-40px_rgba(34,7,94,0.22)]">
            <div className="grid gap-4 text-sm text-slate-600 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-[inset_0_1px_10px_rgba(255,255,255,0.7)]">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Plan status</p>
                <p className="mt-2 text-lg font-semibold text-[color:var(--foreground)]">Active</p>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-[inset_0_1px_10px_rgba(255,255,255,0.7)]">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Usage</p>
                <p className="mt-2 text-lg font-semibold text-[color:var(--foreground)]">Unlimited</p>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-[inset_0_1px_10px_rgba(255,255,255,0.7)]">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Billing cycle</p>
                <p className="mt-2 text-lg font-semibold text-[color:var(--foreground)]">Monthly</p>
              </div>
            </div>
            <div className="grid gap-4 text-sm sm:grid-cols-[minmax(0,0.6fr),minmax(0,0.4fr)] sm:text-left">
              <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/70 bg-white/90 p-6 shadow-[inset_0_1px_10px_rgba(255,255,255,0.7)] sm:flex-row sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[color:var(--foreground)]">Subscription controls</p>
                  <p className="mt-1 text-xs text-slate-500">Change plans, update seats or download invoices instantly.</p>
                </div>
                <ManageSubscriptionButton />
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/90 p-6 text-left shadow-[inset_0_1px_10px_rgba(255,255,255,0.7)]">
                <p className="text-sm font-semibold text-[color:var(--foreground)]">Need assistance?</p>
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
