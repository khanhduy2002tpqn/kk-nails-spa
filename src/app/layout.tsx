import type { Metadata } from "next";
import { Montserrat, Roboto } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ThemeScript } from "@/components/providers/ThemeScript";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingBookButton } from "@/components/layout/FloatingBookButton";
import { PageLoader } from "@/components/layout/PageLoader";
import { BRAND } from "@/lib/constants";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${BRAND.name} | Luxury Nails & Spa in Folcroft, PA`,
    template: `%s | ${BRAND.name}`,
  },
  description:
    "Premium nail salon and spa in Folcroft, Pennsylvania. Gel nails, acrylics, dip powder, waxing, lash extensions, and spa packages. Book online today.",
  keywords: [
    "nail salon Folcroft PA",
    "luxury nails near me",
    "spa manicure pedicure",
    "gel nails Philadelphia",
    "K&K Nails and Spa",
    "acrylic nails Delmar Drive",
    "eyelash extensions Folcroft",
  ],
  openGraph: {
    title: BRAND.name,
    description: BRAND.tagline,
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body
        suppressHydrationWarning
        className={`${montserrat.variable} ${roboto.variable} min-h-screen antialiased`}
      >
        <ThemeProvider>
          <PageLoader />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingBookButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
