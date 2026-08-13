import { NextResponse } from "next/server";
import { PembayaranService } from "@/app/server/services/PembayaranService";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const p = payload as Record<string, unknown>;
  const requiredFields = ["order_id", "status_code", "gross_amount", "signature_key", "transaction_status"];
  const missing = requiredFields.filter((f) => typeof p[f] !== "string");
  if (missing.length > 0) {
    return NextResponse.json({ error: "missing_fields", fields: missing }, { status: 400 });
  }

  const result = await PembayaranService.handleWebhookNotification({
    order_id: p.order_id as string,
    status_code: p.status_code as string,
    gross_amount: p.gross_amount as string,
    signature_key: p.signature_key as string,
    transaction_status: p.transaction_status as string,
    fraud_status: p.fraud_status as string | undefined,
    payment_type: p.payment_type as string | undefined,
  });

  if (!result.ok && result.reason === "invalid_signature") {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  if (!result.ok && result.reason === "order_not_found") {
    return NextResponse.json({ error: "order_not_found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
