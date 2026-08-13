import crypto from "crypto";

function getServerKey() {
  const key = process.env.MIDTRANS_SERVER_KEY;
  if (!key) throw new Error("MIDTRANS_SERVER_KEY belum dikonfigurasi");
  return key;
}

function isProduction() {
  return process.env.MIDTRANS_IS_PRODUCTION === "true";
}

function snapBaseUrl() {
  return isProduction() ? "https://app.midtrans.com/snap/v1" : "https://app.sandbox.midtrans.com/snap/v1";
}

export type SnapTransactionInput = {
  orderId: string;
  grossAmount: number;
  customerName: string;
  customerEmail: string;
};

export const MidtransService = {
  async createSnapTransaction(input: SnapTransactionInput) {
    const serverKey = getServerKey();
    const auth = Buffer.from(`${serverKey}:`).toString("base64");

    const res = await fetch(`${snapBaseUrl()}/transactions`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        transaction_details: {
          order_id: input.orderId,
          gross_amount: Math.round(input.grossAmount),
        },
        customer_details: {
          first_name: input.customerName,
          email: input.customerEmail,
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Midtrans Snap error: ${res.status} ${text}`);
    }

    return res.json() as Promise<{ token: string; redirect_url: string }>;
  },

  verifySignature(params: { orderId: string; statusCode: string; grossAmount: string; signatureKey: string }) {
    const serverKey = getServerKey();
    const raw = `${params.orderId}${params.statusCode}${params.grossAmount}${serverKey}`;
    const expected = crypto.createHash("sha512").update(raw).digest("hex");
    return expected === params.signatureKey;
  },
};
