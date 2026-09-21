export type WalletTab = "deposits" | "expenses" | "payouts" | "set-payout-account";

export interface DepositTransaction {
  id: string;
  paymentId: string;
  paymentMethod: string;
  amount: number;
  currency: string;
  status: "Pending Payment" | "Completed" | "Processing" | "Declined";
  date: string;
  reportedTransfer?: {
    bankName: string;
    accountHolder: string;
    accountNumber: string;
    transferDate: string;
    receiptUrl?: string;
    notes?: string;
  };
}

export interface ExpenseTransaction {
  id: string;
  orderNumber: string;
  description: string;
  amount: number;
  currency: string;
  status: "Completed" | "Refunded";
  date: string;
}

export interface PayoutTransaction {
  id: string;
  payoutId: string;
  amount: number;
  currency: string;
  payoutMethod: string;
  status: "Completed" | "Pending" | "Declined";
  date: string;
}

export interface PayoutAccountSettings {
  payoutMethod: "bank_transfer" | "paypal" | "iban";
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  branchCode: string;
  swiftCode: string;
  paypalEmail: string;
}
