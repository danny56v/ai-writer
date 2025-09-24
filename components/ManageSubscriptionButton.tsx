"use client";
import { useState } from "react";

export default function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);

  const openPortal = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Failed to open portal");
      }

      // Deschide Stripe Customer Portal
      window.location.href = data.url;

    } catch (error) {
      console.error("Error opening portal:", error);
      alert(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={openPortal}
      disabled={loading}
      className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#6b4dff] via-[#ff47c5] to-[#ffb347] px-6 py-3 text-sm font-semibold text-white shadow-[0_24px_44px_-22px_rgba(110,71,255,0.85)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Loading..." : "Manage subscription"}
    </button>
  );
}
