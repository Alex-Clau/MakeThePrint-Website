import { createAdminClient } from "@/lib/supabase/admin";
import { getResendClient, getFromEmail } from "./resend";
import { OrderShippingAddress, type Order } from "@/types";

type FetchOrderForEmailResult =
  | { status: "not_found" }
  | { status: "already_sent" }
  | { status: "ready"; order: Order }
  | { status: "error"; message: string };

async function fetchOrderForConfirmationEmail(
  orderId: string
): Promise<FetchOrderForEmailResult> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      total_amount,
      shipping_address,
      created_at,
      confirmation_email_sent_at,
      order_items (
        id,
        quantity,
        price,
        products (
          id,
          name,
          price,
          images
        )
      )
    `
    )
    .eq("id", orderId)
    .maybeSingle();

  if (error) {
    return { status: "error", message: error.message };
  }
  if (!data) {
    return { status: "not_found" };
  }

  const row = data as unknown as {
    id: string;
    total_amount: number;
    shipping_address: Order["shipping_address"];
    created_at: string;
    confirmation_email_sent_at?: string | null;
    order_items?: Order["order_items"];
  };
  if (row.confirmation_email_sent_at) {
    return { status: "already_sent" };
  }

  const order: Order = {
    id: row.id,
    total_amount: row.total_amount,
    shipping_address: row.shipping_address,
    created_at: row.created_at,
    order_items: row.order_items ?? [],
  };

  return { status: "ready", order };
}

async function markConfirmationEmailSent(orderId: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("orders")
    .update({ confirmation_email_sent_at: new Date().toISOString() })
    .eq("id", orderId)
    .is("confirmation_email_sent_at", null);

  if (error) {
    console.error("[sendOrderConfirmationEmails] mark sent failed", {
      orderId,
      message: error.message,
      code: error.code,
    });
  }
}

function formatInvoiceHtml(order: Order, orderShortId: string): string {
  const date = new Date(order.created_at).toLocaleDateString("ro-RO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const rows = (order.order_items || [])
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee">${item.products?.name?.trim() || "Produs indisponibil"}</td>
          <td style="padding:8px;border-bottom:1px solid #eee">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee">${item.price.toFixed(2)} RON</td>
          <td style="padding:8px;border-bottom:1px solid #eee">${(item.quantity * item.price).toFixed(2)} RON</td>
        </tr>`
    )
    .join("");
  return `
    <h2>Confirmare comandă #${orderShortId}</h2>
    <p>Îți mulțumim pentru comandă. Mai jos găsești detaliile comenzii tale.</p>
    <p><strong>Data comenzii:</strong> ${date}</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0">
      <thead>
        <tr style="background:#f5f5f5">
          <th style="padding:8px;text-align:left">Produs</th>
          <th style="padding:8px;text-align:left">Cant.</th>
          <th style="padding:8px;text-align:left">Preț unitar</th>
          <th style="padding:8px;text-align:left">Total</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="font-size:18px;font-weight:bold">Total de plată: ${order.total_amount.toFixed(2)} RON</p>
    <p>Dacă ai întrebări, răspunde la acest email sau folosește datele de contact de pe site.</p>
  `;
}

function formatSellerNotificationHtml(order: Order, orderShortId: string): string {
  const date = new Date(order.created_at).toLocaleDateString("ro-RO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const addr = order.shipping_address as OrderShippingAddress;
  const shipping = [
    addr?.firstName && addr?.lastName && `${addr.firstName} ${addr.lastName}`,
    addr?.email && `Email: ${addr.email}`,
    addr?.address,
    addr?.city && addr?.state && addr?.zip && `${addr.city}, ${addr.state} ${addr.zip}`,
    addr?.country,
    addr?.phone && `Telefon: ${addr.phone}`,
  ]
    .filter(Boolean)
    .join("<br/>");
  const rows = (order.order_items || [])
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee">${item.products?.name?.trim() || "Produs indisponibil"}</td>
          <td style="padding:8px;border-bottom:1px solid #eee">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee">${(item.quantity * item.price).toFixed(2)} RON</td>
        </tr>`
    )
    .join("");
  return `
    <h2>Comandă nouă #${orderShortId}</h2>
    <p><strong>Data comenzii:</strong> ${date}</p>
    <p><strong>Total:</strong> ${order.total_amount.toFixed(2)} RON</p>
    <h3>Adresă de livrare</h3>
    <p>${shipping}</p>
    <h3>Produse</h3>
    <table style="width:100%;border-collapse:collapse">
      <thead>
        <tr style="background:#f5f5f5">
          <th style="padding:8px;text-align:left">Produs</th>
          <th style="padding:8px;text-align:left">Cant.</th>
          <th style="padding:8px;text-align:left">Total</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

/**
 * Send order confirmation to buyer (invoice) and to store owner (order details + shipping).
 * Idempotent: `confirmation_email_sent_at` is set only after the buyer email is accepted by Resend.
 */
export async function sendOrderConfirmationEmails(orderId: string): Promise<{ ok: boolean; error?: string }> {
  const resend = getResendClient();
  if (!resend) {
    return { ok: false, error: "RESEND_API_KEY not set" };
  }

  const loaded = await fetchOrderForConfirmationEmail(orderId);
  if (loaded.status === "error") {
    return { ok: false, error: loaded.message };
  }
  if (loaded.status === "not_found") {
    return { ok: false, error: "Order not found" };
  }
  if (loaded.status === "already_sent") {
    return { ok: true };
  }

  const order = loaded.order;
  const buyerEmail = (order.shipping_address as OrderShippingAddress)?.email;
  if (!buyerEmail) {
    return { ok: false, error: "No buyer email in shipping address" };
  }

  const storeEmail = process.env.ORDER_NOTIFICATION_EMAIL;
  const fromEmail = getFromEmail();
  const orderShortId = orderId.slice(0, 8);

  try {
    await resend.emails.send({
      from: `Make The Print <${fromEmail}>`,
      to: buyerEmail,
      subject: `Confirmare comandă #${orderShortId}`,
      html: formatInvoiceHtml(order, orderShortId),
    });
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed to send buyer email" };
  }

  await markConfirmationEmailSent(orderId);

  if (storeEmail) {
    try {
      await resend.emails.send({
        from: `Make The Print <${fromEmail}>`,
        to: storeEmail,
        subject: `Comandă nouă #${orderShortId}`,
        html: formatSellerNotificationHtml(order, orderShortId),
      });
    } catch (e) {
      console.error("[sendOrderConfirmationEmails] seller notify failed", {
        orderId,
        message: e instanceof Error ? e.message : "unknown",
      });
    }
  }

  return { ok: true };
}
