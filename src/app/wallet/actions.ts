"use server";

import {
  createMidtransSnapToken,
  convertUsdToIdr,
} from "@/lib/services/midtransService";

export interface CreateWalletTopUpInput {
  amountInUsd: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export async function createWalletTopUpSnapToken(input: CreateWalletTopUpInput) {
  try {
    const {
      amountInUsd,
      customerName = "Member Modesy",
      customerEmail = "member@example.com",
      customerPhone = "+62 812-0000-0000",
    } = input;

    if (isNaN(amountInUsd) || amountInUsd <= 0) {
      return { success: false, error: "Nominal deposit tidak valid." };
    }

    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const depositId = `DEP-${timestamp}-${randomSuffix}`;
    const grossAmountIdr = convertUsdToIdr(amountInUsd);

    const snapRes = await createMidtransSnapToken({
      orderId: depositId,
      grossAmount: grossAmountIdr,
      customerDetails: {
        first_name: customerName,
        email: customerEmail,
        phone: customerPhone,
      },
      items: [
        {
          id: "WALLET-TOPUP",
          name: `Top Up Saldo Modesy ($${amountInUsd})`,
          price: grossAmountIdr,
          quantity: 1,
        },
      ],
    });

    if (!snapRes.success || !snapRes.data?.token) {
      return {
        success: false,
        error: snapRes.error || "Gagal mendapatkan sesi pembayaran Midtrans.",
      };
    }

    return {
      success: true,
      depositId,
      snapToken: snapRes.data.token,
      grossAmountIdr,
    };
  } catch (err) {
    console.error("Error creating wallet top-up snap token:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Terjadi kesalahan pada server",
    };
  }
}
