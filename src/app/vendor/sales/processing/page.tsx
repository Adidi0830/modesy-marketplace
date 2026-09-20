import React from "react";
import { getVendorSalesList } from "@/lib/vendor-data";
import VendorSalesClient from "@/components/vendor/VendorSalesClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Processing Sales - Vendor Dashboard",
  description: "View processing vendor sales orders",
};

export default async function VendorProcessingSalesPage() {
  const sales = await getVendorSalesList();

  return <VendorSalesClient initialSales={sales} defaultStatusFilter="Processing" />;
}
