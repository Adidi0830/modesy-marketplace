import { DepositTransaction, ExpenseTransaction, PayoutTransaction, PayoutAccountSettings } from "@/types/wallet";

export const initialWalletBalance = 9.95;

export const initialDeposits: DepositTransaction[] = [
  {
    id: "dep-1",
    paymentId: "BTR-HMDQRCZDHE-CPZTJXWK",
    paymentMethod: "Bank Transfer",
    amount: 10,
    currency: "USD",
    status: "Pending Payment",
    date: "2026-09-17 / 17:57",
  },
  {
    id: "dep-2",
    paymentId: "BTR-HMDP9KNW90-1Y394WJO",
    paymentMethod: "Bank Transfer",
    amount: 10,
    currency: "USD",
    status: "Pending Payment",
    date: "2026-09-17 / 17:03",
  },
  {
    id: "dep-3",
    paymentId: "BTR-HM95ZHFS7S-369RASZE",
    paymentMethod: "Bank Transfer",
    amount: 10,
    currency: "USD",
    status: "Pending Payment",
    date: "2026-09-13 / 14:19",
  },
  {
    id: "dep-4",
    paymentId: "BTR-HM0LWO7M4I-AG10P9OR",
    paymentMethod: "Bank Transfer",
    amount: 10,
    currency: "USD",
    status: "Pending Payment",
    date: "2026-09-05 / 20:02",
  },
  {
    id: "dep-5",
    paymentId: "BTR-HLW5ZZQSXN-SCTYLLNC",
    paymentMethod: "Bank Transfer",
    amount: 25,
    currency: "USD",
    status: "Pending Payment",
    date: "2026-09-02 / 08:42",
  },
  {
    id: "dep-6",
    paymentId: "BTR-HLVTZUEYA6-8ACII09U",
    paymentMethod: "Bank Transfer",
    amount: 100,
    currency: "USD",
    status: "Pending Payment",
    date: "2026-09-01 / 12:05",
  },
];

export const initialExpenses: ExpenseTransaction[] = [
  {
    id: "exp-1",
    orderNumber: "ORD-89210-449",
    description: "Purchase of Men's Casual Linen Shirt",
    amount: 28.5,
    currency: "USD",
    status: "Completed",
    date: "2026-08-25 / 11:30",
  },
  {
    id: "exp-2",
    orderNumber: "ORD-87123-112",
    description: "Purchase of Wireless ANC Headphones",
    amount: 45.0,
    currency: "USD",
    status: "Completed",
    date: "2026-08-14 / 16:45",
  },
];

export const initialPayouts: PayoutTransaction[] = [
  {
    id: "pay-1",
    payoutId: "PO-7749102-WD",
    amount: 50.0,
    currency: "USD",
    payoutMethod: "Bank Transfer (BCA)",
    status: "Completed",
    date: "2026-08-10 / 14:20",
  },
];

export const initialPayoutAccount: PayoutAccountSettings = {
  payoutMethod: "bank_transfer",
  bankName: "Bank Central Asia (BCA)",
  accountHolder: "Peter Jone",
  accountNumber: "8830192841",
  branchCode: "JKT-001",
  swiftCode: "CENAIDJA",
  paypalEmail: "peter.jone@example.com",
};
