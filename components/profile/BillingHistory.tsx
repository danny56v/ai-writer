"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface InvoiceRow {
  id: string;
  status: string;
  amountDue: number;
  amountPaid: number;
  currency: string;
  created: string;
  hostedInvoiceUrl?: string | null;
  pdfUrl?: string | null;
}

interface BillingHistoryProps {
  customerId: string | null;
}

export default function BillingHistory({ customerId }: BillingHistoryProps) {
  const [invoices, setInvoices] = useState<InvoiceRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) {
      setInvoices([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch("/api/account/billing-history")
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data?.error || "Unable to load billing history");
        }
        return response.json();
      })
      .then((data: { invoices: InvoiceRow[] }) => {
        if (cancelled) return;
        const formatted = data.invoices.map((invoice) => ({
          ...invoice,
          created: new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(invoice.created)),
        }));
        setInvoices(formatted);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Unable to load billing history";
        setError(message);
        setInvoices([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [customerId]);

  if (!customerId) {
    return (
      <div className="rounded-lg border border-dashed border-gray-200 bg-white/70 p-6 text-sm text-gray-500">
        You haven&apos;t started a paid subscription yet. Billing history will show here once you do.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white/80 p-6">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          Loading billing history…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50/80 p-6 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!invoices?.length) {
    return (
      <div className="rounded-lg border border-dashed border-gray-200 bg-white/70 p-6 text-sm text-gray-500">
        No invoices found yet. As soon as we process a payment, the record will appear here.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white/80 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50/80">
          <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
            <th scope="col" className="px-4 py-3">Date</th>
            <th scope="col" className="px-4 py-3">Invoice</th>
            <th scope="col" className="px-4 py-3">Status</th>
            <th scope="col" className="px-4 py-3 text-right">Amount</th>
            <th scope="col" className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="text-gray-700">
              <td className="px-4 py-3">{invoice.created}</td>
              <td className="px-4 py-3 font-medium">{invoice.id}</td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-600">
                  {invoice.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right font-semibold">
                {invoice.currency} {invoice.amountPaid.toFixed(2)}
              </td>
              <td className="px-4 py-3 text-right space-x-2">
                {invoice.hostedInvoiceUrl ? (
                  <Link
                    href={invoice.hostedInvoiceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 transition hover:border-indigo-300 hover:text-indigo-600"
                  >
                    View
                  </Link>
                ) : null}
                {invoice.pdfUrl ? (
                  <Link
                    href={invoice.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 transition hover:border-indigo-300 hover:text-indigo-600"
                  >
                    PDF
                  </Link>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
