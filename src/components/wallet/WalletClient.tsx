"use client";

import React, { useState } from "react";
import Link from "next/link";
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
} from "lucide-react";
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
  const [expenses] = useState<ExpenseTransaction[]>(initialExpenses);
  const [payouts, setPayouts] = useState<PayoutTransaction[]>(initialPayouts);
  const [payoutAccount, setPayoutAccount] = useState<PayoutAccountSettings>(initialPayoutAccount);

  // Modals state
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [selectedDepositForReport, setSelectedDepositForReport] = useState<DepositTransaction | null>(null);
  const [selectedDepositForInvoice, setSelectedDepositForInvoice] = useState<DepositTransaction | null>(null);

  // Add Funds form
  const [depositAmount, setDepositAmount] = useState<string>("10");
  const [depositPaymentMethod, setDepositPaymentMethod] = useState<string>("Bank Transfer");

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
  const handleAddFundsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(depositAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) return;

    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const randomPrefix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newPaymentId = `BTR-HM${randomPrefix}-${randomSuffix}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} / ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

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
    setIsAddFundsOpen(false);
    setDepositAmount("10");
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

  return (
    <div className="w-full">
      {/* Breadcrumbs */}
      <nav className="mb-4 flex items-center gap-1.5 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900 transition">
          Home
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <span className="text-slate-800 font-medium">Wallet</span>
      </nav>

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
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
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
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Payment Method
                </label>
                <select
                  value={depositPaymentMethod}
                  onChange={(e) => setDepositPaymentMethod(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#00C9A7] focus:ring-1 focus:ring-teal-100"
                >
                  <option value="Bank Transfer">Bank Transfer (Manual Verification)</option>
                  <option value="Virtual Account">BCA / Mandiri / BRI Virtual Account</option>
                  <option value="Credit / Debit Card">Credit / Debit Card</option>
                </select>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
                <p>
                  After submitting, a pending payment record will be created. For bank transfers, transfer the exact amount and report your transfer details.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddFundsOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#00C9A7] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#00b093]"
                >
                  Proceed to Deposit
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
    </div>
  );
}
