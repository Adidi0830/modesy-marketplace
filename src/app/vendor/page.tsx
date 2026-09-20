import { getVendorDashboardData } from "@/lib/vendor-data";
import VendorStatCards from "@/components/vendor/VendorStatCards";
import VendorSalesChart from "@/components/vendor/VendorSalesChart";
import VendorMonthlyChart from "@/components/vendor/VendorMonthlyChart";
import VendorCommentsTable from "@/components/vendor/VendorCommentsTable";
import VendorReviewsTable from "@/components/vendor/VendorReviewsTable";
import VendorSalesTable from "@/components/vendor/VendorSalesTable";
import type { VendorDashboardData } from "@/types/vendor-dashboard";

export const dynamic = "force-dynamic";

export default async function VendorDashboardPage() {
  const data: VendorDashboardData = await getVendorDashboardData();

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500">Welcome back, {data.vendor.name}</p>
      </div>

      {/* Stat Cards */}
      <VendorStatCards />

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <VendorSalesChart />
        <VendorMonthlyChart />
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <VendorCommentsTable comments={data.comments} />
        <VendorReviewsTable reviews={data.reviews} />
        <VendorSalesTable sales={data.sales} />
      </div>
    </div>
  );
}
