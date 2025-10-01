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
      type="button"
      className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:bg-indigo-400"
    >
      {loading ? "Loading..." : "Manage Subscription"}
    </button>
  );
}
