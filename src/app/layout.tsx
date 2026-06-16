import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "ImageConvert — Free Browser-Based Image Converter",
    template: "%s | ImageConvert",
  },
  description:
    "Convert HEIC, AVIF, JPG, PNG and WebP images free in your browser. Files never uploaded — 100% private, no account needed.",
  metadataBase: new URL("https://imageconvert.io"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} font-jakarta antialiased`}>
        {children}
      </body>
    </html>
  );
}
