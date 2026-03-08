import type { Metadata } from "next";
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
        {children}
      </body>
    </html>
  );
}
