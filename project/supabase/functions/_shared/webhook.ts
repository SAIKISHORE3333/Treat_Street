/**
 * Computes an HMAC SHA-256 signature for the given payload using the provided secret.
 */
async function generateHmacSignature(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const data = encoder.encode(payload);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, data);
  
  // Convert ArrayBuffer to Hex String
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Delays execution for a given number of milliseconds.
 */
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * Dispatches a webhook securely to ALAIYAOPS with exponential backoff retries.
 */
export async function dispatchWebhook(eventType: string, payloadObj: any): Promise<void> {
  const webhookUrl = Deno.env.get("ALAIYAOPS_WEBHOOK_URL");
  const webhookSecret = Deno.env.get("ALAIYAOPS_WEBHOOK_SECRET");

  if (!webhookUrl || !webhookSecret) {
    console.warn("ALAIYAOPS_WEBHOOK_URL or ALAIYAOPS_WEBHOOK_SECRET missing. Skipping webhook dispatch.");
    return;
  }

  const payloadString = JSON.stringify(payloadObj);
  const signature = await generateHmacSignature(payloadString, webhookSecret);

  const headers = {
    "Content-Type": "application/json",
    "X-Alaiya-Signature": signature,
    "X-Alaiya-Event": eventType,
  };

  const maxRetries = 3;
  const baseDelay = 1000; // 1 second

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers,
        body: payloadString,
      });

      if (response.ok) {
        console.log(`Webhook successfully dispatched for event: ${eventType}`);
        return;
      }
      
      console.warn(`Webhook dispatch failed with status: ${response.status}`);
    } catch (error) {
      console.error(`Webhook network error on attempt ${attempt}:`, error);
    }

    if (attempt < maxRetries) {
      const waitTime = baseDelay * Math.pow(2, attempt); // 1s, 2s, 4s
      console.log(`Retrying webhook in ${waitTime}ms...`);
      await delay(waitTime);
    }
  }

  console.error(`Failed to dispatch webhook for event ${eventType} after ${maxRetries} retries.`);
}
