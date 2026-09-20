import React from "react";
import { getVendorSalesList } from "@/lib/vendor-data";
import VendorSalesClient from "@/components/vendor/VendorSalesClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sales - Vendor Dashboard",
  description: "View and manage vendor sales orders and fulfillment stages",
};

export default async function VendorSalesPage() {
  const sales = await getVendorSalesList();

  return <VendorSalesClient initialSales={sales} />;
}
