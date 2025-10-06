import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { Invoice } from "@/lib/models/interfaces";
import { ObjectId } from "mongodb";

function centsToNumber(amount: number): number {
  return Math.round(amount) / 100;
}

export async function getBillingHistory(userId: string): Promise<Invoice[]> {
  const database = await db();
  const users = database.collection("users");
  const userObjectId = typeof userId === "string" ? new ObjectId(userId) : userId;
  const user = await users.findOne<{ stripeCustomerId?: string }>({ _id: userObjectId }, { projection: { stripeCustomerId: 1 } });

  const customerId = user?.stripeCustomerId;
  if (!customerId) return [];

  const invoices = await stripe.invoices.list({
    customer: customerId,
    limit: 12,
    expand: ["data.lines.data.price"],
  });

  return invoices.data.flatMap((invoice) => {
    if (!invoice.id) return [];

    return [
      {
        id: invoice.id,
        status: invoice.status ?? "open",
        amountDue: centsToNumber(invoice.amount_due ?? 0),
        amountPaid: centsToNumber(invoice.amount_paid ?? 0),
        currency: invoice.currency?.toUpperCase() ?? "USD",
        created: new Date((invoice.created ?? 0) * 1000),
        hostedInvoiceUrl: invoice.hosted_invoice_url,
        pdfUrl: invoice.invoice_pdf,
        periodStart: invoice.period_start ? new Date(invoice.period_start * 1000) : null,
        periodEnd: invoice.period_end ? new Date(invoice.period_end * 1000) : null,
        total: centsToNumber(invoice.total ?? 0),
        subtotal: centsToNumber(invoice.subtotal ?? 0),
        items: (invoice.lines.data || []).map((line) => {
          const priceNickname =
            "price" in line && line.price && typeof line.price === "object" && "nickname" in line.price
              ? line.price.nickname ?? undefined
              : undefined;

          const metadata = line.metadata ? { ...line.metadata } : undefined;

          return {
            id: line.id,
            description: String(
              (typeof line.description === "string" && line.description.trim().length > 0 ? line.description : priceNickname) ??
                "Subscription"
            ),
            amount: centsToNumber(line.amount ?? 0),
            currency: line.currency?.toUpperCase() ?? invoice.currency?.toUpperCase() ?? "USD",
            periodStart: line.period?.start ? new Date(line.period.start * 1000) : null,
            periodEnd: line.period?.end ? new Date(line.period.end * 1000) : null,
            metadata,
          };
        }),
        metadata: invoice.metadata ? { ...invoice.metadata } : undefined,
      },
    ];
  });
}
