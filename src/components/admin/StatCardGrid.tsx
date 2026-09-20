/**
 * @file StatCardGrid component.
 * Renders a responsive grid of summary StatCard widgets: Total Sales,
 * Balance, Products, Pending Products.
 *
 * @param props.stats - Dashboard summary metrics object.
 */
import StatCard from "@/components/admin/StatCard";
import {
  ShoppingCart,
  Wallet,
  Package,
  Clock,
} from "lucide-react";

export default function StatCardGrid({
  stats,
}: {
  stats: {
    totalSales: number;
    balance: number;
    products: number;
    pendingProducts: number;
  };
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total Sales"
        value={stats.totalSales}
        icon={<ShoppingCart size={20} />}
      />
      <StatCard
        label="Balance"
        value={`$${stats.balance.toFixed(2)}`}
        icon={<Wallet size={20} />}
      />
      <StatCard
        label="Products"
        value={stats.products}
        icon={<Package size={20} />}
      />
      <StatCard
        label="Pending Products"
        value={stats.pendingProducts}
        icon={<Clock size={20} />}
      />
    </div>
  );
}
