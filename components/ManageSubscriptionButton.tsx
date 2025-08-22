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
      className="px-4 py-2 rounded bg-blue-600 text-white"
    >
      {loading ? "Loading..." : "Manage Subscription"}
    </button>
  );
}
