"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

type ProfileTab = "followers" | "following" | "reviews";

export function ProfileClient() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>("followers");

  const displayName = currentUser?.fullName || currentUser?.username || "Peter Jone";
  const avatarUrl =
    currentUser?.avatarUrl ||
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&auto=format&fit=crop&q=80";

  const formatJoinDate = (dateString?: string) => {
    if (!dateString) return "August 2026";
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return "August 2026";
      const month = d.toLocaleString("en-US", { month: "long" });
      const year = d.getFullYear();
      return `${month} ${year}`;
    } catch {
      return "August 2026";
    }
  };

  const getTabLabel = (tab: ProfileTab) => {
    switch (tab) {
      case "followers":
        return "Followers";
      case "following":
        return "Following";
      case "reviews":
        return "My Reviews";
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-1.5 text-xs text-neutral-500">
        <Link href="/" className="transition hover:text-neutral-900">
          Home
        </Link>
        <span>/</span>
        <span className="font-normal text-neutral-800">{getTabLabel(activeTab)}</span>
      </div>

      {/* Profile Header Card */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        {/* Avatar */}
        <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 shadow-xs sm:h-36 sm:w-36">
          <Image
            src={avatarUrl}
            alt={displayName}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* User Info */}
        <div className="flex flex-col justify-center pt-1">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            {displayName}
          </h1>

          <div className="mt-1.5 flex items-center gap-2 text-xs text-neutral-500 sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-[#10b981]" />
            <span>
              Last seen: <span className="text-neutral-500">Just Now</span>
            </span>
          </div>

          <p className="mt-3 text-xs text-neutral-500 sm:text-sm">
            Member since {formatJoinDate(currentUser?.createdAt)}
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="mt-10 border-b border-neutral-200">
        <nav className="flex gap-8 text-sm" aria-label="Tabs">
          <button
            type="button"
            onClick={() => setActiveTab("followers")}
            className={`pb-3.5 text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "followers"
                ? "border-b-2 border-neutral-900 text-neutral-900"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Followers (0)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("following")}
            className={`pb-3.5 text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "following"
                ? "border-b-2 border-neutral-900 text-neutral-900"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Following (0)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("reviews")}
            className={`pb-3.5 text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "reviews"
                ? "border-b-2 border-neutral-900 text-neutral-900"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            My Reviews (1)
          </button>
        </nav>
      </div>

      {/* Tab Content Body */}
      <div className="py-24 text-center">
        {activeTab === "reviews" ? (
          <div className="mx-auto max-w-lg rounded-lg border border-neutral-100 bg-white p-6 shadow-xs text-left">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-neutral-800 text-sm">Review on Modern Fashion Shirt</span>
              <span className="text-xs text-amber-500">★★★★★</span>
            </div>
            <p className="mt-2 text-xs text-neutral-500">
              &quot;Barang sangat bagus, kualitas bahan premium dan pengiriman cepat!&quot;
            </p>
          </div>
        ) : (
          <p className="text-sm font-normal text-neutral-400">No records found!</p>
        )}
      </div>
    </div>
  );
}
