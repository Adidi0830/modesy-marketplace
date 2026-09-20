/**
 * @file Admin Dashboard home page.
 * Server Component — orchestrates async data fetching via the dashboard-data
 * utilities, then streams results into modular presentational widgets.
 */
import StatCardGrid from "@/components/admin/StatCardGrid";
import SalesDonutChart from "@/components/admin/SalesDonutChart";
import MonthlySalesLineChart from "@/components/admin/MonthlySalesLineChart";
import LatestCommentsWidget from "@/components/admin/LatestCommentsWidget";
import LatestReviewsWidget from "@/components/admin/LatestReviewsWidget";
import LatestSalesTable from "@/components/admin/LatestSalesTable";
import {
  fetchDashboardStats,
  fetchLatestSales,
  fetchLatestReviews,
  fetchLatestComments,
  fetchMonthlySales,
} from "@/lib/dashboard-data";
import type {
  LatestSale,
  LatestReview,
  LatestComment,
  MonthlySalesPoint,
} from "@/types/dashboard";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [stats, sales, reviews, comments, monthly] = await Promise.all([
    fetchDashboardStats(),
    fetchLatestSales(),
    fetchLatestReviews(),
    fetchLatestComments(),
    fetchMonthlySales(),
  ]);

  return (
    <div className="space-y-6">
      <StatCardGrid stats={stats} />
      <ChartRow sales={sales} reviews={reviews} comments={comments} monthly={monthly} />
    </div>
  );
}

/** Sub-section wrapping charts and latest-data widgets. */
function ChartRow({
  sales, reviews, comments, monthly,
}: {
  sales: LatestSale[];
  reviews: LatestReview[];
  comments: LatestComment[];
  monthly: MonthlySalesPoint[];
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <SalesDonutChart />
        <MonthlySalesLineChart data={monthly} />
      </div>
      <div className="space-y-6">
        <LatestCommentsWidget comments={comments} />
        <LatestReviewsWidget reviews={reviews} />
        <LatestSalesTable sales={sales} />
      </div>
    </div>
  );
}
