import React from "react";
import { VendorComingSoon } from "@/components/vendor/VendorComingSoon";

interface VendorCatchAllPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function VendorCatchAllPage({ params }: VendorCatchAllPageProps) {
  const { slug } = await params;
  return <VendorComingSoon pathSegments={slug || []} />;
}
