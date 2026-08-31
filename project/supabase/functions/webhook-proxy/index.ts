import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { dispatchWebhook } from "../_shared/webhook.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      throw new Error("Method not allowed");
    }

    const { event_type, payload } = await req.json();

    if (!event_type || !payload) {
      throw new Error("Missing event_type or payload");
    }

    // Validate allowed event types to prevent abuse
    const allowedEvents = ["inventory.audit_completed", "sop.waste_logged", "sales.depletion_completed"];
    if (!allowedEvents.includes(event_type)) {
      throw new Error(`Unsupported event_type: ${event_type}`);
    }

    // Fire and forget webhook dispatch
    dispatchWebhook(event_type, payload).catch(e => console.error("Webhook dispatcher error:", e));

    return new Response(
      JSON.stringify({ success: true, message: "Webhook accepted for dispatch" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
