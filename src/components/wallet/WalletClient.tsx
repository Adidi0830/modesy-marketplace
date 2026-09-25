"use client";

import React, { useState } from "react";
import Link from "next/link";
import Script from "next/script";
import {
  Wallet,
  Send,
  Plus,
  FileText,
  CheckCircle2,
  X,
  CreditCard,
  Building2,
  ArrowDownRight,
  ArrowUpRight,
  Printer,
  ChevronRight,
  Loader2,
  ShieldCheck,
  Sparkles,
  QrCode,
  Smartphone,
  Copy,
  Check,
} from "lucide-react";
import { createWalletTopUpSnapToken } from "@/app/wallet/actions";
import {
  initialWalletBalance,
  initialDeposits,
  initialExpenses,
  initialPayouts,
  initialPayoutAccount,
} from "@/lib/mock-data/wallet";
import {
  WalletTab,
  DepositTransaction,
  ExpenseTransaction,
  PayoutTransaction,
  PayoutAccountSettings,
} from "@/types/wallet";

export function WalletClient() {
  const [balance, setBalance] = useState(initialWalletBalance);
  const [activeTab, setActiveTab] = useState<WalletTab>("deposits");
  const [deposits, setDeposits] = useState<DepositTransaction[]>(initialDeposits);
  const [expenses, setExpenses] = useState<ExpenseTransaction[]>(initialExpenses);
  const [payouts, setPayouts] = useState<PayoutTransaction[]>(initialPayouts);
  const [payoutAccount, setPayoutAccount] = useState<PayoutAccountSettings>(initialPayoutAccount);

  // Modals state
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [selectedDepositForReport, setSelectedDepositForReport] = useState<DepositTransaction | null>(null);
  const [selectedDepositForInvoice, setSelectedDepositForInvoice] = useState<DepositTransaction | null>(null);

  // Midtrans Snap Simulator Modal State
  const [midtransSimData, setMidtransSimData] = useState<{
    isOpen: boolean;
    depositId: string;
    amountUsd: number;
    amountIdr: number;
    paymentId: string;
    selectedChannel: "qris" | "bca_va" | "mandiri_va" | "gopay" | "card";
    isProcessing: boolean;
    isSuccess: boolean;
  } | null>(null);
  const [copiedVa, setCopiedVa] = useState(false);

  // Add Funds form
  const [depositAmount, setDepositAmount] = useState<string>("10");
  const [depositPaymentMethod, setDepositPaymentMethod] = useState<string>("Midtrans");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Report Bank Transfer form
  const [reportBankName, setReportBankName] = useState("");
  const [reportAccountHolder, setReportAccountHolder] = useState("");
  const [reportAccountNumber, setReportAccountNumber] = useState("");
  const [reportTransferDate, setReportTransferDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [reportNotes, setReportNotes] = useState("");
  const [reportSuccessMsg, setReportSuccessMsg] = useState<string | null>(null);

  // Payout Account form feedback
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState<string | null>(null);

  // Handlers
  const handleAddFundsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(depositAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) return;

    setIsSubmitting(true);
    setModalError(null);
    setFeedbackMsg(null);

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
      now.getDate()
    ).padStart(2, "0")} / ${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    if (depositPaymentMethod === "Midtrans") {
      try {
        const res = await createWalletTopUpSnapToken({
          amountInUsd: numericAmount,
          customerName: "Member Modesy",
          customerEmail: "member@example.com",
        });

        if (!res.success || !res.snapToken) {
          setModalError(res.error || "Gagal menghubungkan ke Midtrans.");
          setIsSubmitting(false);
          return;
        }

        const newPaymentId = `MTR-${Date.now().toString().slice(-6)}`;
        const newDeposit: DepositTransaction = {
          id: res.depositId || `dep-${Date.now()}`,
          paymentId: newPaymentId,
          paymentMethod: "Midtrans (QRIS / VA / Card)",
          amount: numericAmount,
          currency: "USD",
          status: "Pending Payment",
          date: formattedDate,
        };

        const isRealMidtransToken =
          !res.isSimulated &&
          res.snapToken &&
          !res.snapToken.startsWith("SIM-") &&
          !res.snapToken.startsWith("MOCK-");

        let snapReady = typeof window !== "undefined" && !!window.snap;
        if (isRealMidtransToken && !snapReady && typeof window !== "undefined") {
          // Dynamically load snap.js if not ready
          await new Promise<void>((resolve) => {
            let script = document.querySelector('script[src*="snap.js"]') as HTMLScriptElement;
            if (!script) {
              script = document.createElement("script");
              script.src = snapScriptUrl;
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

        if (isRealMidtransToken && typeof window !== "undefined" && window.snap) {
          setIsAddFundsOpen(false);
          setIsSubmitting(false);

          window.snap.pay(res.snapToken, {
            onSuccess: () => {
              setBalance((prev) => prev + numericAmount);
              setDeposits((prev) => [
                { ...newDeposit, status: "Completed" },
                ...prev.filter((d) => d.id !== newDeposit.id),
              ]);
              setFeedbackMsg({
                type: "success",
                text: `Top-up sebesar $${numericAmount.toFixed(2)} via Midtrans berhasil! Saldo Anda telah bertambah.`,
              });
            },
            onPending: () => {
              setDeposits((prev) => [newDeposit, ...prev]);
              setFeedbackMsg({
                type: "success",
                text: "Transaksi Midtrans dibuat. Menunggu pembayaran Anda.",
              });
            },
            onError: (err: any) => {
              console.error("Midtrans payment error:", err);
              setDeposits((prev) => [{ ...newDeposit, status: "Declined" }, ...prev]);
            },
            onClose: () => {
              setDeposits((prev) => [newDeposit, ...prev]);
            },
          });
        } else {
          // Open interactive Midtrans Snap Popup Simulator
          setIsAddFundsOpen(false);
          setIsSubmitting(false);
          setMidtransSimData({
            isOpen: true,
            depositId: res.depositId || `DEP-${Date.now()}`,
            amountUsd: numericAmount,
            amountIdr: res.grossAmountIdr || numericAmount * 16000,
            paymentId: newPaymentId,
            selectedChannel: "qris",
            isProcessing: false,
            isSuccess: false,
          });
        }
      } catch (err) {
        console.error("Top-up error:", err);
        setIsSubmitting(false);
        // Fallback open simulator
        setIsAddFundsOpen(false);
        setMidtransSimData({
          isOpen: true,
          depositId: `DEP-${Date.now()}`,
          amountUsd: numericAmount,
          amountIdr: numericAmount * 16000,
          paymentId: `MTR-${Date.now().toString().slice(-6)}`,
          selectedChannel: "qris",
          isProcessing: false,
          isSuccess: false,
        });
      }
    } else {
      // Manual Bank Transfer
      const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
      const randomPrefix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const newPaymentId = `BTR-HM${randomPrefix}-${randomSuffix}`;

      const newDeposit: DepositTransaction = {
        id: `dep-${Date.now()}`,
        paymentId: newPaymentId,
        paymentMethod: depositPaymentMethod,
        amount: numericAmount,
        currency: "USD",
        status: "Pending Payment",
        date: formattedDate,
      };

      setDeposits([newDeposit, ...deposits]);
      setIsSubmitting(false);
      setIsAddFundsOpen(false);
      setDepositAmount("10");
    }
  };

  const handleMidtransSimPay = () => {
    if (!midtransSimData) return;
    setMidtransSimData((prev) => (prev ? { ...prev, isProcessing: true } : null));

    setTimeout(() => {
      setMidtransSimData((prev) =>
        prev ? { ...prev, isProcessing: false, isSuccess: true } : null
      );

      setTimeout(() => {
        const now = new Date();
        const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(now.getDate()).padStart(2, "0")} / ${String(
          now.getHours()
        ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

        const channelLabel =
          midtransSimData.selectedChannel === "qris"
            ? "Midtrans (QRIS)"
            : midtransSimData.selectedChannel === "bca_va"
            ? "Midtrans (BCA VA)"
            : midtransSimData.selectedChannel === "mandiri_va"
            ? "Midtrans (Mandiri VA)"
            : midtransSimData.selectedChannel === "gopay"
            ? "Midtrans (GoPay)"
            : "Midtrans (Credit Card)";

        const completedDeposit: DepositTransaction = {
          id: midtransSimData.depositId,
          paymentId: midtransSimData.paymentId,
          paymentMethod: channelLabel,
          amount: midtransSimData.amountUsd,
          currency: "USD",
          status: "Completed",
          date: formattedDate,
        };

        setBalance((prev) => prev + midtransSimData.amountUsd);
        setDeposits((prev) => [completedDeposit, ...prev]);
        setFeedbackMsg({
          type: "success",
          text: `Top-up sebesar $${midtransSimData.amountUsd.toFixed(2)} (Rp ${midtransSimData.amountIdr.toLocaleString(
            "id-ID"
          )}) via Midtrans berhasil! Saldo Anda telah bertambah.`,
        });
        setMidtransSimData(null);
      }, 900);
    }, 1200);
  };

  const handleReportTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDepositForReport) return;

    setDeposits(
      deposits.map((d) =>
        d.id === selectedDepositForReport.id
          ? {
              ...d,
              status: "Processing",
              reportedTransfer: {
                bankName: reportBankName,
                accountHolder: reportAccountHolder,
                accountNumber: reportAccountNumber,
                transferDate: reportTransferDate,
                notes: reportNotes,
              },
            }
          : d
      )
    );

    setReportSuccessMsg("Bank transfer report submitted successfully!");
    setTimeout(() => {
      setReportSuccessMsg(null);
      setSelectedDepositForReport(null);
      setReportBankName("");
      setReportAccountHolder("");
      setReportAccountNumber("");
      setReportNotes("");
    }, 1500);
  };

  const handleSavePayoutAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutSuccessMsg("Payout account settings saved successfully!");
    setTimeout(() => setPayoutSuccessMsg(null), 3000);
  };

  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";
  const isProd = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
  const snapScriptUrl =
    process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL ||
    (isProd
      ? "https://app.midtrans.com/snap/snap.js"
      : "https://app.sandbox.midtrans.com/snap/snap.js");

  return (
    <div className="w-full">
      <Script
        src={snapScriptUrl}
        data-client-key={clientKey || "SB-Mid-client-test-dummy-key"}
        strategy="afterInteractive"
      />

      {/* Breadcrumbs */}
      <nav className="mb-4 flex items-center gap-1.5 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900 transition">
          Home
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <span className="text-slate-800 font-medium">Wallet</span>
      </nav>

      {/* Feedback Banner */}
      {feedbackMsg && (
        <div
          className={`mb-6 flex items-center justify-between rounded-xl p-4 text-xs font-medium shadow-sm transition-all ${
            feedbackMsg.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{feedbackMsg.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMsg(null)}
            className="text-slate-400 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Page Title */}
      <h1 className="mb-8 text-2xl font-bold text-slate-900">Wallet</h1>

      {/* Wallet Balance Card */}
      <div className="mx-auto mb-8 max-w-xl">
        <div className="relative rounded-xl border border-slate-200/90 bg-white p-8 text-center shadow-sm">
          {/* Add Funds Button */}
          <button
            type="button"
            onClick={() => setIsAddFundsOpen(true)}
            className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            <Plus className="h-3.5 w-3.5 text-slate-600" />
            <span>Add Funds</span>
          </button>

          {/* Wallet Icon */}
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-[#00C9A7]">
            <svg
              className="h-8 w-8 fill-[#00C9A7]"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20 7H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 12H4V9h16v10z" />
              <path d="M19 3H5c-.55 0-1 .45-1 1s.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1z" />
              <circle cx="16" cy="14" r="1.5" />
            </svg>
          </div>

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Wallet Balance
          </p>
          <p className="mt-1 text-4xl font-extrabold text-slate-900 tracking-tight">
            ${balance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("deposits")}
          className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition ${
            activeTab === "deposits"
              ? "bg-[#00C9A7] text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Deposits
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("expenses")}
          className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition ${
            activeTab === "expenses"
              ? "bg-[#00C9A7] text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Expenses
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("payouts")}
          className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition ${
            activeTab === "payouts"
              ? "bg-[#00C9A7] text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Payouts
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("set-payout-account")}
          className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition ${
            activeTab === "set-payout-account"
              ? "bg-[#00C9A7] text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Set Payout Account
        </button>
      </div>

      {/* Tab 1: Deposits */}
      {activeTab === "deposits" && (
        <div className="overflow-x-auto rounded-xl border border-slate-200/90 bg-white shadow-sm">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-700">
                <th className="px-6 py-4">Payment Id</th>
                <th className="px-6 py-4">Payment Method</th>
                <th className="px-6 py-4">Deposit Amount</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {deposits.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition">
                  {/* Payment ID */}
                  <td className="px-6 py-4 font-mono text-xs text-slate-800">
                    {item.paymentId}
                  </td>

                  {/* Payment Method */}
                  <td className="px-6 py-4 text-slate-700">
                    {item.paymentMethod}
                  </td>

                  {/* Deposit Amount & Status / Action */}
                  <td className="px-6 py-4">
                    <div className="text-slate-800">
                      <span className="font-semibold">${item.amount} ({item.currency})</span>
                      <span className="text-slate-500"> - </span>
                      <span
                        className={
                          item.status === "Completed"
                            ? "font-medium text-emerald-600"
                            : item.status === "Processing"
                            ? "font-medium text-amber-600"
                            : "text-slate-600"
                        }
                      >
                        {item.status}
                      </span>
                    </div>

                    {item.status === "Pending Payment" && (
                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={() => setSelectedDepositForReport(item)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#00C9A7] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#00b093]"
                        >
                          <Send className="h-3 w-3" />
                          <span>Report Bank Transfer</span>
                        </button>
                      </div>
                    )}

                    {item.status === "Processing" && (
                      <div className="mt-1 text-xs text-amber-600 flex items-center gap-1">
                        <span className="inline-block h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                        Transfer reported • In verification
                      </div>
                    )}
                  </td>

                  {/* Date & Invoice */}
                  <td className="px-6 py-4">
                    <div className="text-xs text-slate-600">{item.date}</div>
                    <button
                      type="button"
                      onClick={() => setSelectedDepositForInvoice(item)}
                      className="mt-1 text-xs font-medium text-sky-600 transition hover:text-sky-800 hover:underline"
                    >
                      View Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Expenses */}
      {activeTab === "expenses" && (
        <div className="overflow-x-auto rounded-xl border border-slate-200/90 bg-white shadow-sm">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-700">
                <th className="px-6 py-4">Order Number</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {expenses.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 font-mono text-xs text-slate-800">
                    {item.orderNumber}
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 font-semibold text-rose-600">
                    -${item.amount.toFixed(2)} ({item.currency})
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600">
                    {item.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Payouts */}
      {activeTab === "payouts" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-600">
              Withdraw funds from your wallet balance to your configured payout account.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200/90 bg-white shadow-sm">
            <table className="w-full min-w-[700px] text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-700">
                  <th className="px-6 py-4">Payout Id</th>
                  <th className="px-6 py-4">Payout Method</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {payouts.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-mono text-xs text-slate-800">
                      {item.payoutId}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {item.payoutMethod}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      ${item.amount.toFixed(2)} ({item.currency})
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">
                      {item.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Set Payout Account */}
      {activeTab === "set-payout-account" && (
        <div className="mx-auto max-w-2xl rounded-xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-slate-900">
            Payout Account Settings
          </h2>
          <p className="mb-6 text-xs text-slate-500">
            Set your payout preferences and bank details to receive payments or withdraw funds.
          </p>

          {payoutSuccessMsg && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-700">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{payoutSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleSavePayoutAccount} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Payout Method
              </label>
              <select
                value={payoutAccount.payoutMethod}
                onChange={(e) =>
                  setPayoutAccount({
                    ...payoutAccount,
                    payoutMethod: e.target.value as "bank_transfer" | "paypal" | "iban",
                  })
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#00C9A7] focus:ring-1 focus:ring-teal-100"
              >
                <option value="bank_transfer">Bank Transfer</option>
                <option value="paypal">PayPal</option>
                <option value="iban">IBAN / Wire Transfer</option>
              </select>
            </div>

            {payoutAccount.payoutMethod === "bank_transfer" && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={payoutAccount.bankName}
                      onChange={(e) =>
                        setPayoutAccount({ ...payoutAccount, bankName: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#00C9A7] focus:ring-1 focus:ring-teal-100"
                      placeholder="e.g. Bank Central Asia (BCA)"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      value={payoutAccount.accountHolder}
                      onChange={(e) =>
                        setPayoutAccount({ ...payoutAccount, accountHolder: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#00C9A7] focus:ring-1 focus:ring-teal-100"
                      placeholder="Full Name on Account"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={payoutAccount.accountNumber}
                      onChange={(e) =>
                        setPayoutAccount({ ...payoutAccount, accountNumber: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#00C9A7] focus:ring-1 focus:ring-teal-100"
                      placeholder="Bank Account Number"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      SWIFT / BIC Code
                    </label>
                    <input
                      type="text"
                      value={payoutAccount.swiftCode}
                      onChange={(e) =>
                        setPayoutAccount({ ...payoutAccount, swiftCode: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#00C9A7] focus:ring-1 focus:ring-teal-100"
                      placeholder="e.g. CENAIDJA"
                    />
                  </div>
                </div>
              </>
            )}

            {payoutAccount.payoutMethod === "paypal" && (
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  PayPal Email Address
                </label>
                <input
                  type="email"
                  value={payoutAccount.paypalEmail}
                  onChange={(e) =>
                    setPayoutAccount({ ...payoutAccount, paypalEmail: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#00C9A7] focus:ring-1 focus:ring-teal-100"
                  placeholder="your.paypal@example.com"
                  required
                />
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="rounded-lg bg-[#00C9A7] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#00b093]"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Add Funds */}
      {isAddFundsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-[#00C9A7]">
                  <Plus className="h-4 w-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Add Funds to Wallet</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddFundsOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddFundsSubmit} className="space-y-4">
              {modalError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 flex items-start gap-2">
                  <X className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                  <div className="flex-1 leading-relaxed">{modalError}</div>
                </div>
              )}

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Deposit Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm font-bold text-slate-400">
                    $
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-[#00C9A7] focus:ring-1 focus:ring-teal-100"
                    placeholder="10.00"
                    required
                  />
                </div>
                <div className="mt-2 flex gap-2">
                  {["10", "25", "50", "100"].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setDepositAmount(preset)}
                      className={`flex-1 rounded-md py-1 text-xs font-medium border transition ${
                        depositAmount === preset
                          ? "border-[#00C9A7] bg-teal-50 text-[#00C9A7]"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      ${preset}
                    </button>
                  ))}
                </div>
                <div className="mt-2 text-[11px] text-slate-500 flex justify-between items-center bg-slate-50 px-2.5 py-1.5 rounded-md">
                  <span>Estimasi Total (IDR):</span>
                  <span className="font-bold text-slate-800">
                    Rp {((parseFloat(depositAmount) || 0) * 16000).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Payment Method
                </label>
                <div className="space-y-2">
                  <label
                    className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition ${
                      depositPaymentMethod === "Midtrans"
                        ? "border-[#00C9A7] bg-teal-50/50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="depositMethod"
                      value="Midtrans"
                      checked={depositPaymentMethod === "Midtrans"}
                      onChange={(e) => setDepositPaymentMethod(e.target.value)}
                      className="mt-0.5 text-[#00C9A7] focus:ring-[#00C9A7]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">
                          Midtrans Gateway (Instant)
                        </span>
                        <span className="text-[10px] font-bold bg-[#00C9A7] text-white px-1.5 py-0.5 rounded">
                          Popup Snap
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-slate-500">
                        QRIS, BCA / Mandiri / BRI / BNI Virtual Account, GoPay, ShopeePay, Kartu Kredit
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition ${
                      depositPaymentMethod === "Bank Transfer"
                        ? "border-[#00C9A7] bg-teal-50/50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="depositMethod"
                      value="Bank Transfer"
                      checked={depositPaymentMethod === "Bank Transfer"}
                      onChange={(e) => setDepositPaymentMethod(e.target.value)}
                      className="mt-0.5 text-[#00C9A7] focus:ring-[#00C9A7]"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900">
                        Manual Bank Transfer
                      </span>
                      <p className="mt-0.5 text-[11px] text-slate-500">
                        Transfer langsung ke rekening kami dan laporkan rincian transfer
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddFundsOpen(false)}
                  disabled={isSubmitting}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#00C9A7] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#00b093] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <span>Proceed to Deposit</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Report Bank Transfer */}
      {selectedDepositForReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-[#00C9A7]">
                  <Send className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Report Bank Transfer</h3>
                  <p className="font-mono text-xs text-slate-500">
                    {selectedDepositForReport.paymentId}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDepositForReport(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {reportSuccessMsg ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500 animate-bounce" />
                <p className="mt-3 text-sm font-semibold text-slate-800">{reportSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleReportTransferSubmit} className="space-y-3.5">
                <div className="rounded-lg border border-teal-100 bg-teal-50/50 p-3 text-xs text-slate-700">
                  <div className="flex justify-between font-medium">
                    <span>Deposit Amount:</span>
                    <span className="font-bold text-[#00C9A7]">
                      ${selectedDepositForReport.amount} ({selectedDepositForReport.currency})
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Your Bank Name
                    </label>
                    <input
                      type="text"
                      value={reportBankName}
                      onChange={(e) => setReportBankName(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#00C9A7] focus:ring-1 focus:ring-teal-100"
                      placeholder="e.g. BCA, Mandiri, BNI"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      value={reportAccountHolder}
                      onChange={(e) => setReportAccountHolder(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#00C9A7] focus:ring-1 focus:ring-teal-100"
                      placeholder="Name on bank account"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={reportAccountNumber}
                      onChange={(e) => setReportAccountNumber(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#00C9A7] focus:ring-1 focus:ring-teal-100"
                      placeholder="Bank account number"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Transfer Date
                    </label>
                    <input
                      type="date"
                      value={reportTransferDate}
                      onChange={(e) => setReportTransferDate(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#00C9A7] focus:ring-1 focus:ring-teal-100"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={reportNotes}
                    onChange={(e) => setReportNotes(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#00C9A7] focus:ring-1 focus:ring-teal-100"
                    placeholder="Transfer reference number or additional details"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedDepositForReport(null)}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#00C9A7] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#00b093]"
                  >
                    <Send className="h-3 w-3" />
                    <span>Submit Report</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: View Invoice */}
      {selectedDepositForInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#00C9A7]" />
                <h3 className="text-base font-bold text-slate-900">Deposit Invoice</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDepositForInvoice(null)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Invoice Content */}
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-bold tracking-tight text-slate-900">Modesy</h4>
                  <p className="text-xs text-slate-500">Marketplace &amp; Digital Store</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-slate-700">
                    {selectedDepositForInvoice.paymentId}
                  </span>
                  <p className="text-xs text-slate-500">{selectedDepositForInvoice.date}</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                      Billed To
                    </p>
                    <p className="mt-1 font-bold text-slate-800">Peter Jone</p>
                    <p className="text-slate-500">Member Account</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                      Payment Details
                    </p>
                    <p className="mt-1 font-bold text-slate-800">
                      {selectedDepositForInvoice.paymentMethod}
                    </p>
                    <p className="text-slate-500">Status: {selectedDepositForInvoice.status}</p>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 font-semibold text-slate-700">
                    <tr>
                      <th className="px-4 py-2.5">Description</th>
                      <th className="px-4 py-2.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-4 py-3 text-slate-800">
                        Wallet Balance Deposit ({selectedDepositForInvoice.paymentId})
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-slate-900">
                        ${selectedDepositForInvoice.amount.toFixed(2)} USD
                      </td>
                    </tr>
                  </tbody>
                  <tfoot className="border-t border-slate-200 bg-slate-50/50 font-bold text-slate-900">
                    <tr>
                      <td className="px-4 py-3">Total Amount</td>
                      <td className="px-4 py-3 text-right text-sm text-[#00C9A7]">
                        ${selectedDepositForInvoice.amount.toFixed(2)} USD
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="text-center text-xs text-slate-400">
                Thank you for using Modesy Wallet.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Midtrans Snap Simulator Popup */}
      {midtransSimData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-100 flex flex-col">
            {/* Midtrans Snap Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-5 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-400/20 text-[#00C9A7]">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold tracking-tight">MODESY MARKETPLACE</h3>
                    <p className="font-mono text-[10px] text-slate-400">Order ID: {midtransSimData.depositId}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMidtransSimData(null)}
                  disabled={midtransSimData.isProcessing}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition disabled:opacity-30"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Amount Display */}
              <div className="mt-4 flex items-baseline justify-between rounded-xl bg-white/10 px-4 py-3 backdrop-blur-xs">
                <div>
                  <span className="text-[10px] font-semibold uppercase text-slate-300">Total Pembayaran</span>
                  <p className="text-xl font-black tracking-tight text-white">
                    Rp {midtransSimData.amountIdr.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-300">Nominal Wallet</span>
                  <p className="text-xs font-bold text-[#00C9A7]">
                    ${midtransSimData.amountUsd.toFixed(2)} USD
                  </p>
                </div>
              </div>
            </div>

            {/* Midtrans Body */}
            <div className="p-5 flex-1 max-h-[440px] overflow-y-auto">
              {midtransSimData.isSuccess ? (
                <div className="py-10 text-center animate-in zoom-in-95 duration-200">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">Pembayaran Berhasil!</h4>
                  <p className="mt-1 text-xs text-slate-500">
                    Saldo sebesar ${midtransSimData.amountUsd.toFixed(2)} berhasil ditambahkan ke wallet Modesy Anda.
                  </p>
                </div>
              ) : midtransSimData.isProcessing ? (
                <div className="py-12 text-center">
                  <Loader2 className="mx-auto h-12 w-12 text-[#00C9A7] animate-spin mb-4" />
                  <h4 className="text-base font-bold text-slate-800">Memverifikasi Pembayaran...</h4>
                  <p className="mt-1 text-xs text-slate-400">Menghubungkan ke jaringan perbankan Midtrans</p>
                </div>
              ) : (
                <div>
                  <p className="mb-3 text-xs font-bold text-slate-700">Pilih Metode Pembayaran</p>

                  {/* Channel Tabs */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() =>
                        setMidtransSimData((prev) =>
                          prev ? { ...prev, selectedChannel: "qris" } : null
                        )
                      }
                      className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-center border transition ${
                        midtransSimData.selectedChannel === "qris"
                          ? "border-[#00C9A7] bg-teal-50/70 text-[#00C9A7] font-bold shadow-xs"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-xs font-medium"
                      }`}
                    >
                      <QrCode className="h-5 w-5 mb-1" />
                      <span className="text-[11px]">QRIS</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setMidtransSimData((prev) =>
                          prev ? { ...prev, selectedChannel: "bca_va" } : null
                        )
                      }
                      className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-center border transition ${
                        midtransSimData.selectedChannel === "bca_va"
                          ? "border-[#00C9A7] bg-teal-50/70 text-[#00C9A7] font-bold shadow-xs"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-xs font-medium"
                      }`}
                    >
                      <Building2 className="h-5 w-5 mb-1" />
                      <span className="text-[11px]">BCA VA</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setMidtransSimData((prev) =>
                          prev ? { ...prev, selectedChannel: "gopay" } : null
                        )
                      }
                      className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-center border transition ${
                        midtransSimData.selectedChannel === "gopay"
                          ? "border-[#00C9A7] bg-teal-50/70 text-[#00C9A7] font-bold shadow-xs"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-xs font-medium"
                      }`}
                    >
                      <Smartphone className="h-5 w-5 mb-1" />
                      <span className="text-[11px]">E-Wallet</span>
                    </button>
                  </div>

                  {/* QRIS Channel View */}
                  {midtransSimData.selectedChannel === "qris" && (
                    <div className="rounded-xl border border-slate-200 p-4 text-center bg-slate-50/50">
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-100/80 px-2.5 py-0.5 text-[10px] font-bold text-teal-800 mb-2">
                        <span>QRIS Nasional</span> • <span>GoPay / OVO / Dana / BCA</span>
                      </div>
                      
                      {/* Realistic QR Graphic */}
                      <div className="mx-auto my-2 flex h-40 w-40 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white p-2 shadow-xs">
                        <div className="relative flex h-full w-full flex-col items-center justify-center bg-slate-900 rounded-lg p-3 text-white">
                          <QrCode className="h-24 w-24 text-white" />
                          <span className="mt-1 text-[9px] font-mono tracking-widest text-[#00C9A7]">SCAN &amp; BAYAR</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 mb-4">
                        Buka aplikasi e-wallet / m-banking dan scan QRIS di atas untuk menyelesaikan top-up.
                      </p>

                      <button
                        type="button"
                        onClick={handleMidtransSimPay}
                        className="w-full rounded-xl bg-[#00C9A7] py-3 text-xs font-bold text-white shadow-md shadow-[#00C9A7]/20 transition hover:bg-[#00b093] active:scale-[0.99]"
                      >
                        Simulasikan Scan &amp; Bayar QRIS Selesai
                      </button>
                    </div>
                  )}

                  {/* BCA Virtual Account Channel View */}
                  {midtransSimData.selectedChannel === "bca_va" && (
                    <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 space-y-3">
                      <div>
                        <span className="text-[10px] font-semibold uppercase text-slate-400">Nomor Virtual Account</span>
                        <div className="mt-1 flex items-center justify-between rounded-xl bg-white border border-slate-200 p-3">
                          <span className="font-mono text-sm font-bold text-slate-900">88019 1827 3849 1029</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText("88019182738491029");
                              setCopiedVa(true);
                              setTimeout(() => setCopiedVa(false), 2000);
                            }}
                            className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                          >
                            {copiedVa ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                            <span>{copiedVa ? "Copied" : "Copy"}</span>
                          </button>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500 space-y-1 bg-white p-3 rounded-xl border border-slate-100">
                        <p className="font-semibold text-slate-700">Petunjuk Pembayaran:</p>
                        <p>1. Masuk ke m-BCA &gt; m-Transfer &gt; BCA Virtual Account</p>
                        <p>2. Masukkan nomor VA di atas dan konfirmasi pembayaran</p>
                      </div>

                      <button
                        type="button"
                        onClick={handleMidtransSimPay}
                        className="w-full rounded-xl bg-[#00C9A7] py-3 text-xs font-bold text-white shadow-md shadow-[#00C9A7]/20 transition hover:bg-[#00b093] active:scale-[0.99]"
                      >
                        Simulasikan Transfer VA Selesai
                      </button>
                    </div>
                  )}

                  {/* GoPay / E-Wallet Channel View */}
                  {midtransSimData.selectedChannel === "gopay" && (
                    <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 text-center space-y-3">
                      <div className="flex items-center justify-center gap-2">
                        <span className="rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">GoPay</span>
                        <span className="rounded-md bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white">ShopeePay</span>
                        <span className="rounded-md bg-purple-600 px-2 py-0.5 text-[10px] font-bold text-white">OVO</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Aplikasi e-wallet Anda akan terbuka otomatis untuk konfirmasi saldo sebesar{" "}
                        <strong className="text-slate-900">Rp {midtransSimData.amountIdr.toLocaleString("id-ID")}</strong>.
                      </p>

                      <button
                        type="button"
                        onClick={handleMidtransSimPay}
                        className="w-full rounded-xl bg-[#00C9A7] py-3 text-xs font-bold text-white shadow-md shadow-[#00C9A7]/20 transition hover:bg-[#00b093] active:scale-[0.99]"
                      >
                        Buka E-Wallet &amp; Bayar Sekarang
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Midtrans Footer */}
            <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#00C9A7]" />
                <span>Secured by Midtrans Snap 256-bit SSL</span>
              </div>
              <span className="font-mono text-[10px]">v1.0.0</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
