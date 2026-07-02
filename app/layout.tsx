import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: {
    default: "Cricket AI Studio",
    template: "%s | Cricket AI Studio",
  },
  description:
    "A premium frontend foundation for uploading photos that will later become realistic cricket-themed AI images.",
};

/**
 * Root layout shared by all App Router pages.
 * Phase 1 includes only presentational UI and local browser interactions.
 */
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
