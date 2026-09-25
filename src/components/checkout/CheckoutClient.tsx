"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import {
  CheckCircle2,
  Check,
  Plus,
  Pencil,
  Trash2,
  Store,
  ArrowRight,
  ShieldCheck,
  Truck,
  Building2,
  X,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatUSD } from "@/lib/utils/product-utils";
import { placeOrder } from "@/app/orders/actions";

interface Address {
  id: string;
  title: string;
  recipientName: string;
  phone: string;
  addressLine: string;
  city: string;
  country: string;
  zipCode: string;
}

const DEFAULT_ADDRESSES: Address[] = [
  {
    id: "addr-1",
    title: "Home",
    recipientName: "Peter Jones",
    phone: "+62 812-3456-7890",
    addressLine: "Test Address 45343",
    city: "Centre",
    country: "France",
    zipCode: "45343",
  },
];

interface PaymentGatewayOption {
  id: string;
  name: string;
  subtitle?: string;
  logos: string[];
}

const PAYMENT_METHODS: PaymentGatewayOption[] = [
  {
    id: "paypal",
    name: "PayPal",
    logos: ["VISA", "Mastercard", "AMEX", "Discover", "PayPal"],
  },
  {
    id: "stripe",
    name: "Stripe",
    logos: ["VISA", "Mastercard", "AMEX", "Maestro", "JCB", "stripe"],
  },
  {
    id: "paystack",
    name: "Paystack",
    logos: ["VISA", "Mastercard", "Verve", "paystack"],
  },
  {
    id: "razorpay",
    name: "Razorpay",
    logos: ["VISA", "Mastercard", "AMEX", "RuPay", "Razorpay"],
  },
  {
    id: "flutterwave",
    name: "Flutterwave",
    logos: ["VISA", "Mastercard", "Verve", "flutterwave"],
  },
  {
    id: "iyzico",
    name: "Iyzico",
    logos: ["VISA", "Mastercard", "AMEX", "troy", "iyzico"],
  },
  {
    id: "midtrans",
    name: "Midtrans",
    subtitle: "QRIS, BCA/Mandiri/BNI/BRI VA, Cards",
    logos: ["VISA", "Mastercard", "JCB", "QRIS", "midtrans"],
  },
  {
    id: "paytabs",
    name: "PayTabs",
    logos: ["VISA", "Mastercard", "AMEX", "PayTabs"],
  },
  {
    id: "yoomoney",
    name: "YooMoney",
    logos: ["VISA", "Mastercard", "МИР", "money"],
  },
  {
    id: "mercadopago",
    name: "Mercado Pago",
    logos: ["VISA", "Mastercard", "AMEX", "Boleto", "mercado"],
  },
  {
    id: "bank_transfer",
    name: "Bank Transfer",
    subtitle: "Make your payment directly into our bank account.",
    logos: [],
  },
  {
    id: "cod",
    name: "Cash on Delivery (COD)",
    subtitle: "Pay cash upon product delivery to your address.",
    logos: [],
  },
];

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options: {
          onSuccess?: (result: any) => void;
          onPending?: (result: any) => void;
          onError?: (result: any) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

export function CheckoutClient() {
  const { items, cartSubtotal, clearCart } = useCart();
  const { currentUser } = useAuth();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Shipping state
  const [addresses, setAddresses] = useState<Address[]>(DEFAULT_ADDRESSES);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("addr-1");
  const [useSameBilling, setUseSameBilling] = useState(true);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Address form inputs
  const [modalTitle, setModalTitle] = useState("Home");
  const [modalRecipient, setModalRecipient] = useState(currentUser?.fullName || "Peter Jones");
  const [modalPhone, setModalPhone] = useState("+62 812-3456-7890");
  const [modalAddressLine, setModalAddressLine] = useState("Test Address 45343");
  const [modalCity, setModalCity] = useState("Centre");
  const [modalCountry, setModalCountry] = useState("France");
  const [modalZip, setModalZip] = useState("45343");

  // Step 2: Payment method state
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("paypal");
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Submission & status state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const shippingCost = items.length > 0 ? 10.0 : 0;
  const salesTax = items.length > 0 ? Math.round(cartSubtotal * 0.05 * 100) / 100 : 0;
  const totalAmount = cartSubtotal + shippingCost + salesTax;

  const currentAddress =
    addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const handleOpenAddAddress = () => {
    setEditingAddress(null);
    setModalTitle("Home");
    setModalRecipient(currentUser?.fullName || "Peter Jones");
    setModalPhone("+62 812-3456-7890");
    setModalAddressLine("");
    setModalCity("");
    setModalCountry("France");
    setModalZip("");
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr: Address) => {
    setEditingAddress(addr);
    setModalTitle(addr.title);
    setModalRecipient(addr.recipientName);
    setModalPhone(addr.phone);
    setModalAddressLine(addr.addressLine);
    setModalCity(addr.city);
    setModalCountry(addr.country);
    setModalZip(addr.zipCode);
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddress) {
      setAddresses((prev) =>
        prev.map((a) =>
          a.id === editingAddress.id
            ? {
                ...a,
                title: modalTitle,
                recipientName: modalRecipient,
                phone: modalPhone,
                addressLine: modalAddressLine,
                city: modalCity,
                country: modalCountry,
                zipCode: modalZip,
              }
            : a
        )
      );
    } else {
      const newAddr: Address = {
        id: `addr-${Date.now()}`,
        title: modalTitle,
        recipientName: modalRecipient,
        phone: modalPhone,
        addressLine: modalAddressLine,
        city: modalCity,
        country: modalCountry,
        zipCode: modalZip,
      };
      setAddresses((prev) => [...prev, newAddr]);
      setSelectedAddressId(newAddr.id);
    }
    setIsAddressModalOpen(false);
  };

  const handleDeleteAddress = (id: string) => {
    if (addresses.length <= 1) return;
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    if (selectedAddressId === id) {
      setSelectedAddressId(addresses[0].id);
    }
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("customerName", currentAddress?.recipientName || "Peter Jones");
    formData.append("customerEmail", currentUser?.email || "peter@example.com");
    formData.append("customerPhone", currentAddress?.phone || "+62 812-0000-0000");
    formData.append(
      "address",
      `${currentAddress?.addressLine || ""}, ${currentAddress?.city || ""}, ${currentAddress?.country || ""} ${currentAddress?.zipCode || ""}`
    );
    formData.append("paymentMethod", selectedPaymentMethod);
    if (currentUser?.id) {
      formData.append("userId", currentUser.id);
    }

    const itemsForOrder = items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));
    formData.append("items", JSON.stringify(itemsForOrder));

    try {
      const result = await placeOrder(formData);

      if (!result.success) {
        setErrorMsg(result.error || "Gagal memesan produk");
        setIsLoading(false);
        return;
      }

      // If Midtrans Snap token returned and snap is available in browser
      if (
        (selectedPaymentMethod === "midtrans" || selectedPaymentMethod === "qris" || selectedPaymentMethod === "transfer") &&
        result.snapToken &&
        !result.snapToken.startsWith("SIM-")
      ) {
        const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";
        const isProd = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
        const snapUrl =
          process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL ||
          (isProd
            ? "https://app.midtrans.com/snap/snap.js"
            : "https://app.sandbox.midtrans.com/snap/snap.js");

        let snapReady = typeof window !== "undefined" && !!window.snap;
        if (!snapReady && typeof window !== "undefined") {
          await new Promise<void>((resolve) => {
            let script = document.querySelector('script[src*="snap.js"]') as HTMLScriptElement;
            if (!script) {
              script = document.createElement("script");
              script.src = snapUrl;
              script.setAttribute("data-client-key", clientKey || "");
              script.async = true;
              document.body.appendChild(script);
            }
            script.onload = () => resolve();
            script.onerror = () => resolve();
            setTimeout(resolve, 1500);
          });
          snapReady = typeof window !== "undefined" && !!window.snap;
        }

        if (typeof window !== "undefined" && window.snap) {
          window.snap.pay(result.snapToken, {
            onSuccess: async () => {
              await clearCart();
              setOrderSuccess(true);
              setIsLoading(false);
            },
            onPending: async () => {
              await clearCart();
              setOrderSuccess(true);
              setIsLoading(false);
            },
            onError: (err: any) => {
              console.error("Midtrans payment error:", err);
              setErrorMsg("Pembayaran gagal atau dibatalkan.");
              setIsLoading(false);
            },
            onClose: async () => {
              await clearCart();
              setOrderSuccess(true);
              setIsLoading(false);
            },
          });
          return;
        }
      } else {
        await clearCart();
        setOrderSuccess(true);
        setIsLoading(false);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan saat checkout");
      setIsLoading(false);
    }
  };

  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-800">Checkout</h1>
        <div className="rounded-lg border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">
          <ShoppingBag className="mx-auto mb-3 h-12 w-12 text-slate-300" />
          <p className="text-base font-semibold text-slate-700">Keranjang belanja Anda kosong</p>
          <p className="mt-1 text-xs text-slate-400">Silakan pilih produk favorit Anda untuk melanjutkan pesanan.</p>
          <Link
            href="/"
            className="mt-5 inline-flex items-center gap-1.5 rounded-md px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:opacity-90"
            style={{ backgroundColor: "#00a896" }}
          >
            Mulai Belanja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Script
        src={
          process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL ||
          (process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
            ? "https://app.midtrans.com/snap/snap.js"
            : "https://app.sandbox.midtrans.com/snap/snap.js")
        }
        data-client-key={
          process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ||
          "SB-Mid-client-test-dummy-key"
        }
        strategy="afterInteractive"
      />

      <h1 className="text-2xl font-bold tracking-tight text-slate-800">Checkout</h1>

      {orderSuccess && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 p-6 text-emerald-900 shadow-sm">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-6 w-6 text-emerald-600 shrink-0" />
            <div className="space-y-2">
              <h2 className="text-base font-bold text-emerald-800">Pesanan Berhasil Dibuat!</h2>
              <p className="text-xs text-emerald-700">
                Terima kasih, pesanan Anda telah berhasil tercatat di sistem kami dan akan segera dikirimkan ke alamat tujuan.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <Link
                  href="/orders"
                  className="inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:opacity-90"
                  style={{ backgroundColor: "#00a896" }}
                >
                  Lihat Riwayat Pesanan
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  Kembali ke Beranda
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3.5 text-xs font-medium text-rose-700">
          {errorMsg}
        </div>
      )}

      {/* 2-Column Checkout Layout matching the 3 pictures */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Left Column: 3 Steps Form (8 cols) */}
        <div className="space-y-6 lg:col-span-8">
          {/* ========================================================
              STEP 1: SHIPPING INFORMATION
          ======================================================== */}
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-800">
                1. Shipping Information
              </h2>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 hover:underline"
                >
                  Edit
                </button>
              )}
            </div>

            {currentStep === 1 && (
              <div className="mt-5 space-y-6">
                {/* Shipping Address Header & Add link */}
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-700">Shipping Address</h3>
                  <button
                    type="button"
                    onClick={handleOpenAddAddress}
                    className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    <Plus size={14} />
                    <span>Add New Address</span>
                  </button>
                </div>

                {/* Address Cards */}
                <div className="space-y-3">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`flex cursor-pointer items-start justify-between rounded-lg border p-4 transition ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-500"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                              isSelected
                                ? "border-emerald-600 bg-emerald-600 text-white"
                                : "border-slate-300 bg-white"
                            }`}
                          >
                            {isSelected && <Check size={10} strokeWidth={3} />}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">{addr.title}</p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {addr.addressLine} {addr.zipCode} {addr.city}/{addr.country}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditAddress(addr);
                            }}
                            className="text-slate-400 hover:text-slate-600 p-1"
                            title="Edit Address"
                          >
                            <Pencil size={13} />
                          </button>
                          {addresses.length > 1 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAddress(addr.id);
                              }}
                              className="text-slate-400 hover:text-rose-600 p-1"
                              title="Delete Address"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Billing Address Checkbox */}
                <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-600">
                  <input
                    type="checkbox"
                    checked={useSameBilling}
                    onChange={(e) => setUseSameBilling(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#00a896] accent-[#00a896]"
                  />
                  <span>Use same address for billing address</span>
                </label>

                {/* Shipping Method */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-sm font-semibold text-slate-700">Shipping Method</h3>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <Store size={14} className="text-slate-500" />
                    <span>Admin</span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-[#00a896] bg-teal-50/20 p-4 ring-1 ring-[#00a896]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#00a896] text-white">
                        <Check size={10} strokeWidth={3} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Flat Rate</p>
                        <p className="text-[11px] text-slate-500">Standard shipping</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-800">$10</span>
                  </div>
                </div>

                {/* Continue Action */}
                <div className="flex items-center justify-end pt-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="inline-flex items-center gap-1.5 rounded-md px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:opacity-90"
                    style={{ backgroundColor: "#00a896" }}
                  >
                    <span>Continue to Payment Method</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                <div className="pt-2">
                  <Link
                    href="/"
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    &lt; Return to cart
                  </Link>
                </div>
              </div>
            )}
          </section>

          {/* ========================================================
              STEP 2: PAYMENT METHOD
          ======================================================== */}
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-800">
                2. Payment Method
              </h2>
              {currentStep > 2 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 hover:underline"
                >
                  Edit
                </button>
              )}
            </div>

            {currentStep === 2 && (
              <div className="mt-5 space-y-4">
                <div className="space-y-2.5">
                  {PAYMENT_METHODS.map((pm) => {
                    const isSelected = selectedPaymentMethod === pm.id;
                    return (
                      <label
                        key={pm.id}
                        className={`flex cursor-pointer items-center justify-between rounded-lg border p-3.5 transition ${
                          isSelected
                            ? "border-[#00a896] bg-teal-50/20 ring-1 ring-[#00a896]"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="payment_method"
                            checked={isSelected}
                            onChange={() => setSelectedPaymentMethod(pm.id)}
                            className="h-4 w-4 text-[#00a896] accent-[#00a896]"
                          />
                          <div>
                            <span className="text-xs font-semibold text-slate-800">
                              {pm.name}
                            </span>
                            {pm.subtitle && (
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {pm.subtitle}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Badges / Logos */}
                        {pm.logos.length > 0 && (
                          <div className="hidden sm:flex items-center gap-1.5 flex-wrap justify-end">
                            {pm.logos.map((logo) => (
                              <span
                                key={logo}
                                className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 uppercase"
                              >
                                {logo}
                              </span>
                            ))}
                          </div>
                        )}
                      </label>
                    );
                  })}
                </div>

                {/* Terms and conditions checkbox */}
                <label className="flex cursor-pointer items-center gap-2 pt-2 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#00a896] accent-[#00a896]"
                  />
                  <span>
                    I have read and agree to the{" "}
                    <Link href="#terms" className="font-semibold text-slate-800 underline">
                      Terms &amp; Conditions
                    </Link>
                  </span>
                </label>

                {/* Continue Button */}
                <div className="flex items-center justify-end pt-3">
                  <button
                    type="button"
                    disabled={!agreedToTerms}
                    onClick={() => setCurrentStep(3)}
                    className="inline-flex items-center gap-1.5 rounded-md px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: "#00a896" }}
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                <div className="pt-2">
                  <Link
                    href="/"
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    &lt; Return to cart
                  </Link>
                </div>
              </div>
            )}
          </section>

          {/* ========================================================
              STEP 3: PAYMENT
          ======================================================== */}
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-800">3. Payment</h2>
            </div>

            {currentStep === 3 && (
              <div className="mt-5 space-y-6 text-center">
                {/* Bank Transfer Details (matching Picture 3) */}
                {selectedPaymentMethod === "bank_transfer" && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-slate-800">Bank Transfer</h3>

                    <div className="mx-auto max-w-md space-y-3 rounded-lg border border-slate-100 bg-slate-50/50 p-4 text-xs text-slate-700">
                      <div>
                        <p className="font-bold text-slate-900">Bank Austria</p>
                        <p className="text-slate-500">Bank code: 284732</p>
                        <p className="text-slate-500">Account Number: 2104534636</p>
                        <p className="text-slate-500 font-mono">IBAN: AT02204323545464523423</p>
                      </div>

                      <div className="border-t border-slate-200 pt-3">
                        <p className="font-bold text-slate-900">Blom Bank France</p>
                        <p className="text-slate-500">Account number: 30066 10041 0066777775 16</p>
                        <p className="text-slate-500 font-mono">IBAN: FR763463473634525235235</p>
                      </div>
                    </div>

                    <p className="mx-auto max-w-md text-xs text-slate-500 leading-relaxed">
                      Once you have placed your order, you can make your payment to one of these bank accounts. Please add your order number to your payment description.
                    </p>
                  </div>
                )}

                {/* Midtrans Details */}
                {selectedPaymentMethod === "midtrans" && (
                  <div className="mx-auto max-w-md space-y-3 rounded-lg border border-slate-100 bg-slate-50 p-5 text-xs text-slate-600">
                    <h3 className="text-sm font-bold text-slate-800">Midtrans Payment Gateway</h3>
                    <p>
                      Pembayaran aman melalui QRIS, BCA/Mandiri/BNI/BRI Virtual Account, atau Kartu Kredit. Jendela popup Midtrans Snap akan terbuka saat Anda menekan tombol Place Order.
                    </p>
                  </div>
                )}

                {/* PayPal / Stripe / Other Gateways */}
                {selectedPaymentMethod !== "bank_transfer" && selectedPaymentMethod !== "midtrans" && (
                  <div className="mx-auto max-w-md space-y-2 rounded-lg border border-slate-100 bg-slate-50 p-5 text-xs text-slate-600">
                    <h3 className="text-sm font-bold text-slate-800 capitalize">
                      {selectedPaymentMethod} Payment
                    </h3>
                    <p>
                      Klik tombol Place Order di bawah untuk mengonfirmasi pesanan Anda melalui {selectedPaymentMethod.toUpperCase()}.
                    </p>
                  </div>
                )}

                {/* Place Order Button */}
                <div className="pt-4">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={handlePlaceOrder}
                    className="inline-flex w-full max-w-md items-center justify-center gap-2 rounded-md py-3 text-sm font-bold text-white shadow-sm transition hover:opacity-95 disabled:opacity-50"
                    style={{ backgroundColor: "#00a896" }}
                  >
                    <Check size={16} strokeWidth={3} />
                    <span>{isLoading ? "Processing Order..." : "Place Order"}</span>
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Order Summary (N) (4 cols) */}
        <div className="lg:col-span-4">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs">
            <h2 className="border-b border-slate-100 pb-3 text-sm font-bold text-slate-800">
              Order Summary ({items.length})
            </h2>

            {/* Cart Items List */}
            <div className="divide-y divide-slate-100 py-3">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-start gap-3 py-3">
                  <img
                    src={item.product.image_url || "/placeholder.png"}
                    alt={item.product.title}
                    className="h-14 w-14 rounded-md border border-slate-200 object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                      {item.product.title}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Color: Dark Size: S
                    </p>
                    <span className="mt-0.5 inline-block rounded bg-blue-50 px-1.5 py-0.2 text-[10px] font-semibold text-blue-600">
                      Seller: Admin
                    </span>

                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Quantity: {item.quantity}</span>
                      <span className="font-bold text-slate-800">
                        {formatUSD(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 border-t border-slate-100 pt-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">{formatUSD(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="font-semibold text-slate-800">{formatUSD(shippingCost)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Sale Tax (5%)</span>
                <span className="font-semibold text-slate-800">{formatUSD(salesTax)}</span>
              </div>

              <div className="border-t border-slate-100 pt-3 flex justify-between text-sm font-bold text-slate-900">
                <span>Total</span>
                <span>{formatUSD(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">
                {editingAddress ? "Edit Shipping Address" : "Add New Shipping Address"}
              </h3>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="mb-1 block font-medium text-slate-600">Address Label</label>
                <input
                  type="text"
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  placeholder="e.g. Home, Office"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-slate-800 outline-none focus:border-[#00a896]"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-slate-600">Recipient Name</label>
                <input
                  type="text"
                  value={modalRecipient}
                  onChange={(e) => setModalRecipient(e.target.value)}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-slate-800 outline-none focus:border-[#00a896]"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-slate-600">Phone Number</label>
                <input
                  type="tel"
                  value={modalPhone}
                  onChange={(e) => setModalPhone(e.target.value)}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-slate-800 outline-none focus:border-[#00a896]"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-slate-600">Address Line</label>
                <input
                  type="text"
                  value={modalAddressLine}
                  onChange={(e) => setModalAddressLine(e.target.value)}
                  placeholder="Street, house number"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-slate-800 outline-none focus:border-[#00a896]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-medium text-slate-600">City</label>
                  <input
                    type="text"
                    value={modalCity}
                    onChange={(e) => setModalCity(e.target.value)}
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-slate-800 outline-none focus:border-[#00a896]"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-600">Postal Code</label>
                  <input
                    type="text"
                    value={modalZip}
                    onChange={(e) => setModalZip(e.target.value)}
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-slate-800 outline-none focus:border-[#00a896]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block font-medium text-slate-600">Country</label>
                <input
                  type="text"
                  value={modalCountry}
                  onChange={(e) => setModalCountry(e.target.value)}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-slate-800 outline-none focus:border-[#00a896]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="rounded-md border border-slate-200 px-4 py-2 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md px-5 py-2 font-semibold text-white transition hover:opacity-90"
                  style={{ backgroundColor: "#00a896" }}
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
