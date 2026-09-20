import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { mapMidtransStatus, verifyMidtransSignature } from "@/lib/services/midtransService";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type,
    } = body;

    if (!order_id || !status_code || !gross_amount) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    // Optional verification if signature is provided
    if (signature_key && process.env.MIDTRANS_SERVER_KEY) {
      const isValid = verifyMidtransSignature({
        order_id,
        status_code,
        gross_amount,
        signature_key,
      });

      if (!isValid && process.env.NODE_ENV === "production") {
        console.warn("Invalid Midtrans signature for order:", order_id);
        return NextResponse.json({ message: "Invalid signature" }, { status: 403 });
      }
    }

    const orderStatus = mapMidtransStatus(transaction_status, fraud_status);

    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { error } = await supabase
        .from("orders")
        .update({
          status: orderStatus,
          payment_method: payment_type || "midtrans",
        })
        .eq("id", order_id);

      if (error) {
        console.error("Failed to update order status from Midtrans notification:", error);
      }
    }

    revalidatePath("/orders");
    revalidatePath("/vendor/sales");
    revalidatePath("/");

    return NextResponse.json({ status: "ok", order_id, orderStatus });
  } catch (err) {
    console.error("Error processing Midtrans webhook:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
