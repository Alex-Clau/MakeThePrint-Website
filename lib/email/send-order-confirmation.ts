import { createAdminClient } from "@/lib/supabase/admin";
import { getResendClient, getFromEmail } from "./resend";
import { OrderShippingAddress, Order} from "@/types";
/**
 * Atomically claim "we send the confirmation email" for this order.
 * Returns true if we claimed it (should send), false if already sent.
 * If the confirmation_email_sent_at column is missing, we still return true so email is sent.
 */
async function claimConfirmationEmailSent(orderId: string): Promise<boolean> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("orders")
      .update({ confirmation_email_sent_at: new Date().toISOString() })
      .eq("id", orderId)
      .is("confirmation_email_sent_at", null)
      .select("id")
      .maybeSingle();

    if (error) {
      return true; // Still try to send (e.g. column not added yet)
    }
    if (!data) return false; // Already sent
    return true;
  } catch {
    return true; // Still try to send
  }
}

async function fetchOrderForEmail(orderId: string): Promise<Order | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      total_amount,
      shipping_address,
      created_at,
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
    .single();

  if (error || !data) return null;
  return data as unknown as Order;
}

function formatInvoiceHtml(order: Order, orderShortId: string): string {
  const date = new Date(order.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const rows = (order.order_items || [])
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee">${item.products?.name ?? "Product"}</td>
          <td style="padding:8px;border-bottom:1px solid #eee">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee">${item.price.toFixed(2)} RON</td>
          <td style="padding:8px;border-bottom:1px solid #eee">${(item.quantity * item.price).toFixed(2)} RON</td>
        </tr>`
    )
    .join("");
  return `
    <h2>Order Confirmation #${orderShortId}</h2>
    <p>Thank you for your order. Here is your invoice.</p>
    <p><strong>Order date:</strong> ${date}</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0">
      <thead>
        <tr style="background:#f5f5f5">
          <th style="padding:8px;text-align:left">Item</th>
          <th style="padding:8px;text-align:left">Qty</th>
          <th style="padding:8px;text-align:left">Unit price</th>
          <th style="padding:8px;text-align:left">Total</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="font-size:18px;font-weight:bold">Total: ${order.total_amount.toFixed(2)} RON</p>
    <p>If you have any questions, please contact us.</p>
  `;
}

function formatSellerNotificationHtml(order: Order, orderShortId: string): string {
  const date = new Date(order.created_at).toLocaleDateString("en-US", {
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
    addr?.phone && `Phone: ${addr.phone}`,
  ]
    .filter(Boolean)
    .join("<br/>");
  const rows = (order.order_items || [])
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee">${item.products?.name ?? "Product"}</td>
          <td style="padding:8px;border-bottom:1px solid #eee">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee">${(item.quantity * item.price).toFixed(2)} RON</td>
        </tr>`
    )
    .join("");
  return `
    <h2>New order #${orderShortId}</h2>
    <p><strong>Order date:</strong> ${date}</p>
    <p><strong>Total:</strong> ${order.total_amount.toFixed(2)} RON</p>
    <h3>Shipping address</h3>
    <p>${shipping}</p>
    <h3>Items</h3>
    <table style="width:100%;border-collapse:collapse">
      <thead>
        <tr style="background:#f5f5f5">
          <th style="padding:8px;text-align:left">Item</th>
          <th style="padding:8px;text-align:left">Qty</th>
          <th style="padding:8px;text-align:left">Total</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

/**
 * Send order confirmation to buyer (invoice) and to store owner (order details + shipping).
 * Only sends once per order (uses confirmation_email_sent_at).
 */
export async function sendOrderConfirmationEmails(orderId: string): Promise<{ ok: boolean; error?: string }> {
  const resend = getResendClient();
  if (!resend) {
    return { ok: false, error: "RESEND_API_KEY not set" };
  }

  const claimed = await claimConfirmationEmailSent(orderId);
  if (!claimed) {
    return { ok: true };
  }

  const order = await fetchOrderForEmail(orderId);
  if (!order) {
    return { ok: false, error: "Order not found" };
  }

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
      subject: `Order confirmation #${orderShortId}`,
      html: formatInvoiceHtml(order, orderShortId),
    });
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed to send buyer email" };
  }

  if (storeEmail) {
    try {
      await resend.emails.send({
        from: `Make The Print <${fromEmail}>`,
        to: storeEmail,
        subject: `New order #${orderShortId}`,
        html: formatSellerNotificationHtml(order, orderShortId),
      });
    } catch {
      // Buyer email already sent; don't fail the whole operation
    }
  }

  return { ok: true };
}
