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
      className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-amber-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-400/40 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Loading..." : "Manage subscription"}
    </button>
  );
}
