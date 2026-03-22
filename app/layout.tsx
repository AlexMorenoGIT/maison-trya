import type { Metadata } from "next";
import { CartProvider } from "@/lib/cart-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maison trya.",
  description: "Entre férocité et vulnérabilité",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="bg-cream text-tortoise antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
