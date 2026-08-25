import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface OrderItem {
  product_name: string;
  supplier_name: string;
  category: string;
  quantity: number;
  unit_price: number;
}

interface Order {
  id: string;
  staff_name: string;
  department: string;
  branch_name: string | null;
  notes: string | null;
  total_cost: number;
  created_at: string;
  order_items: OrderItem[];
}

interface SupplierGroup {
  name: string;
  email: string;
  items: OrderItem[];
}

function buildEmailHtml(order: Order, supplier: SupplierGroup): string {
  const orderId = order.id.slice(0, 8).toUpperCase();
  const branchName = order.branch_name ?? "Head Office";
  const approvalDate = new Date().toLocaleDateString("en-GB", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const itemRows = supplier.items
    .map(item => {
      const total = (item.unit_price * item.quantity).toFixed(2);
      return `
        <tr style="border-bottom:1px solid #e2e8f0;">
          <td style="padding:10px 14px;color:#1e293b;font-size:14px;">${item.product_name}</td>
          <td style="padding:10px 14px;text-align:center;color:#1e293b;font-size:14px;font-weight:600;">${item.quantity}</td>
          <td style="padding:10px 14px;text-align:right;color:#1e293b;font-size:14px;">£${item.unit_price.toFixed(2)}</td>
          <td style="padding:10px 14px;text-align:right;color:#0f172a;font-size:14px;font-weight:700;">£${total}</td>
        </tr>`;
    })
    .join("");

  const subtotal = supplier.items.reduce((s, i) => s + i.unit_price * i.quantity, 0).toFixed(2);

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Purchase Order</title></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;">
<tr><td>
  <table width="600" cellpadding="0" cellspacing="0" align="center" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:600px;width:100%;">

    <!-- Header -->
    <tr>
      <td style="background:linear-gradient(135deg,#1a3a5c 0%,#0f2440 100%);padding:28px 32px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <div style="font-size:22px;font-weight:800;color:#ffffff;letter-spacing:0.5px;">TREAT STREET</div>
              <div style="font-size:11px;color:#94a3b8;letter-spacing:2px;margin-top:2px;text-transform:uppercase;">Corporate Franchise</div>
            </td>
            <td align="right">
              <div style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:8px;padding:8px 14px;display:inline-block;">
                <div style="font-size:10px;color:#94a3b8;letter-spacing:1.5px;text-transform:uppercase;">Reference</div>
                <div style="font-size:16px;font-weight:700;color:#f8c84a;letter-spacing:1px;">PO-${orderId}</div>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Subject Banner -->
    <tr>
      <td style="background:#fef9ee;border-bottom:2px solid #f8c84a;padding:14px 32px;">
        <p style="margin:0;font-size:13px;font-weight:700;color:#92400e;letter-spacing:0.5px;text-transform:uppercase;">
          Urgent: Purchase Order Request &mdash; Treat Street ${branchName}
        </p>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding:28px 32px;">
        <p style="margin:0 0 18px;font-size:15px;color:#334155;line-height:1.6;">Dear <strong>${supplier.name} Team</strong>,</p>
        <p style="margin:0 0 18px;font-size:14px;color:#475569;line-height:1.7;">I hope this email finds you well. Please accept this official Purchase Order on behalf of <strong>Treat Street Corporate Franchise</strong> for our <strong>${branchName}</strong> location. I have personally reviewed and authorized this inventory request, and we would greatly appreciate your assistance in processing it at your earliest convenience.</p>

        <!-- PO Details Box -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f7ff;border:1px solid #bfdbfe;border-radius:10px;margin-bottom:24px;">
          <tr><td style="padding:18px 20px;">
            <div style="font-size:11px;font-weight:700;color:#1e40af;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;">Purchase Order Details</div>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="padding:4px 0;font-size:13px;color:#64748b;width:180px;">Shipping Destination</td><td style="padding:4px 0;font-size:13px;font-weight:600;color:#0f172a;">Treat Street &mdash; ${branchName}</td></tr>
              <tr><td style="padding:4px 0;font-size:13px;color:#64748b;">Authorized By</td><td style="padding:4px 0;font-size:13px;font-weight:600;color:#0f172a;">Sai Kishore Jammu (Head of Operations)</td></tr>
              <tr><td style="padding:4px 0;font-size:13px;color:#64748b;">Order Reference</td><td style="padding:4px 0;font-size:13px;font-weight:700;color:#1e40af;">PO-${orderId}</td></tr>
              <tr><td style="padding:4px 0;font-size:13px;color:#64748b;">Date of Authorization</td><td style="padding:4px 0;font-size:13px;font-weight:600;color:#0f172a;">${approvalDate}</td></tr>
              <tr><td style="padding:4px 0;font-size:13px;color:#64748b;">Submitted By</td><td style="padding:4px 0;font-size:13px;color:#334155;">${order.staff_name} &mdash; ${order.department}</td></tr>
            </table>
          </td></tr>
        </table>

        <!-- Items Table -->
        <div style="font-size:11px;font-weight:700;color:#1e40af;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;">Itemized Supply Request</div>
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:20px;">
          <thead>
            <tr style="background:#1a3a5c;">
              <th style="padding:11px 14px;text-align:left;font-size:11px;font-weight:700;color:#e2e8f0;letter-spacing:1px;text-transform:uppercase;">Item Name</th>
              <th style="padding:11px 14px;text-align:center;font-size:11px;font-weight:700;color:#e2e8f0;letter-spacing:1px;text-transform:uppercase;">Qty</th>
              <th style="padding:11px 14px;text-align:right;font-size:11px;font-weight:700;color:#e2e8f0;letter-spacing:1px;text-transform:uppercase;">Unit Price</th>
              <th style="padding:11px 14px;text-align:right;font-size:11px;font-weight:700;color:#e2e8f0;letter-spacing:1px;text-transform:uppercase;">Total</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
          <tfoot>
            <tr style="background:#f8fafc;">
              <td colspan="3" style="padding:12px 14px;text-align:right;font-size:14px;font-weight:700;color:#0f172a;">TOTAL ESTIMATED ORDER VALUE</td>
              <td style="padding:12px 14px;text-align:right;font-size:16px;font-weight:800;color:#1a3a5c;">£${subtotal}</td>
            </tr>
          </tfoot>
        </table>

        <p style="margin:0 0 16px;font-size:14px;color:#475569;line-height:1.7;">Could you please reply directly to this email to confirm receipt of this order and provide us with an estimated delivery timeline? Please send the official invoice through our standard franchise billing channel.</p>
        <p style="margin:0 0 24px;font-size:14px;color:#475569;line-height:1.7;">Thank you very much for your continued partnership and excellent service.</p>

        <!-- Signature -->
        <table cellpadding="0" cellspacing="0" style="border-top:2px solid #f8c84a;padding-top:18px;margin-top:4px;width:100%;">
          <tr><td>
            <div style="font-size:15px;font-weight:700;color:#0f172a;">Sai Kishore Jammu</div>
            <div style="font-size:13px;color:#64748b;margin-top:2px;">Head of Operations</div>
            <div style="font-size:13px;font-weight:600;color:#1a3a5c;margin-top:1px;">Treat Street Corporate Franchise</div>
          </td></tr>
        </table>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background:#f1f5f9;padding:14px 32px;border-top:1px solid #e2e8f0;">
        <p style="margin:0;font-size:11px;color:#94a3b8;text-align:center;">This is an automated purchase order generated by the ALIA Inventory Engine &bull; Treat Street Corporate Franchise &bull; Confidential</p>
      </td>
    </tr>

  </table>
</td></tr>
</table>
</body>
</html>`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { order_id } = await req.json();
    if (!order_id) throw new Error("order_id is required");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendKey = Deno.env.get("RESEND_API_KEY");
    const fromEmail = "kishorejammu1563@gmail.com";

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch order + items
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", order_id)
      .maybeSingle();

    if (orderErr || !order) throw orderErr ?? new Error("Order not found");

    // Group items by supplier, fetch supplier emails
    const supplierNames: string[] = [...new Set((order.order_items as OrderItem[]).map(i => i.supplier_name))];

    const { data: suppliers, error: supErr } = await supabase
      .from("suppliers")
      .select("name, email")
      .in("name", supplierNames);

    if (supErr) throw supErr;

    const supplierMap = new Map((suppliers ?? []).map((s: { name: string; email: string | null }) => [s.name, s.email]));

    const groups: SupplierGroup[] = supplierNames.map(name => ({
      name,
      email: supplierMap.get(name) ?? "",
      items: (order.order_items as OrderItem[]).filter(i => i.supplier_name === name),
    }));

    const results: { supplier: string; status: string; error?: string }[] = [];

    for (const group of groups) {
      if (!group.email) {
        results.push({ supplier: group.name, status: "skipped", error: "No email configured" });
        continue;
      }

      const html = buildEmailHtml(order as Order, group);
      const orderId = order.id.slice(0, 8).toUpperCase();
      const branchName = order.branch_name ?? "Head Office";
      const subject = `Urgent: Purchase Order Request - Treat Street ${branchName} [PO-${orderId}]`;

      if (!resendKey) {
        results.push({ supplier: group.name, status: "skipped", error: "RESEND_API_KEY not configured" });
        continue;
      }

      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from: fromEmail, to: group.email, subject, html }),
      });

      if (emailRes.ok) {
        results.push({ supplier: group.name, status: "sent" });
      } else {
        const body = await emailRes.text();
        results.push({ supplier: group.name, status: "failed", error: body });
      }
    }

    // Mark order as Ordered
    await supabase.from("orders").update({ status: "Ordered" }).eq("id", order_id);

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
