import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { LoginModal } from "@/components/auth/LoginModal";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WishlistModal } from "@/components/wishlist/WishlistModal";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Modesy Marketplace - Buy Nice & Unique Products",
  description:
    "Modesy is a multi-vendor marketplace platform offering unique fashion, electronics, accessories, and authentic brands.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-white text-neutral-900">
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              {children}
              <LoginModal />
              <CartDrawer />
              <WishlistModal />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
