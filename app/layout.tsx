import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Laksh Kundnani",
  description:
    "Data Engineer at RBC. Architecting enterprise pipelines, real-time streaming systems, and cloud-native data platforms.",
  keywords: ["Data Engineer", "RBC", "Sheridan College", "Apache Spark", "Kafka", "Snowflake", "Portfolio"],
  authors: [{ name: "Laksh" }],
  openGraph: {
    title: "Laksh Kundnani",
    description: "Somewhere between whiteboards and terminals.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#101318",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
