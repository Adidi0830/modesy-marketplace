import crypto from "crypto";

const MIDTRANS_SERVER_KEY =
  process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-test-dummy-key";
const MIDTRANS_CLIENT_KEY =
  process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "SB-Mid-client-test-dummy-key";
const IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === "true";

const SNAP_API_URL = IS_PRODUCTION
  ? "https://app.midtrans.com/snap/v1/transactions"
  : "https://app.sandbox.midtrans.com/snap/v1/transactions";

export interface MidtransCustomerDetails {
  first_name: string;
  email: string;
  phone?: string;
  billing_address?: {
    first_name?: string;
    address?: string;
    phone?: string;
  };
  shipping_address?: {
    first_name?: string;
    address?: string;
    phone?: string;
  };
}

export interface MidtransItemDetail {
  id: string;
  price: number;
  quantity: number;
  name: string;
}

export interface CreateSnapTokenParams {
  orderId: string;
  grossAmount: number; // in IDR
  customerDetails: MidtransCustomerDetails;
  items: MidtransItemDetail[];
}

export interface SnapResponse {
  token: string;
  redirect_url: string;
}

/**
 * Konversi nilai USD ke IDR untuk pembayaran Midtrans (1 USD = Rp 16.000)
 */
export function convertUsdToIdr(amountInUsd: number): number {
  return Math.round(amountInUsd * 16000);
}

/**
 * Membuat Snap Token dari Midtrans REST API
 */
export async function createMidtransSnapToken(
  params: CreateSnapTokenParams
): Promise<{ success: boolean; data?: SnapResponse; error?: string }> {
  try {
    const authHeader = `Basic ${Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString(
      "base64"
    )}`;

    const payload = {
      transaction_details: {
        order_id: params.orderId,
        gross_amount: params.grossAmount,
      },
      customer_details: params.customerDetails,
      item_details: params.items,
      credit_card: {
        secure: true,
      },
      callbacks: {
        finish: `${
          process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
        }/orders`,
      },
    };

    const response = await fetch(SNAP_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.warn("Midtrans API response error:", data);
      // Fallback mock token for sandbox dev if dummy key is used
      return {
        success: false,
        error: data.error_messages ? data.error_messages.join(", ") : "Midtrans Error",
      };
    }

    return {
      success: true,
      data: {
        token: data.token,
        redirect_url: data.redirect_url,
      },
    };
  } catch (err) {
    console.error("Midtrans snap token creation error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Midtrans connection error",
    };
  }
}

/**
 * Verifikasi signature webhook dari Midtrans
 */
export function verifyMidtransSignature(payload: {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
}): boolean {
  const { order_id, status_code, gross_amount, signature_key } = payload;
  const hash = crypto
    .createHash("sha512")
    .update(`${order_id}${status_code}${gross_amount}${MIDTRANS_SERVER_KEY}`)
    .digest("hex");

  return hash === signature_key;
}

/**
 * Memetakan status transaksi Midtrans ke status order Modesy
 */
export function mapMidtransStatus(
  transactionStatus: string,
  fraudStatus?: string
): "completed" | "pending" | "cancelled" {
  if (transactionStatus === "capture") {
    if (fraudStatus === "challenge") {
      return "pending";
    }
    return "completed";
  }
  if (transactionStatus === "settlement") {
    return "completed";
  }
  if (
    transactionStatus === "cancel" ||
    transactionStatus === "deny" ||
    transactionStatus === "expire"
  ) {
    return "cancelled";
  }
  if (transactionStatus === "pending") {
    return "pending";
  }
  return "pending";
}
