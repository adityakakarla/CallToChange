import type { Metadata } from "next";
import { Quicksand } from "next/font/google"; // Import Quicksand
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  weight: ['300', '400', '500', '700'], // Specify the weights you need
});

export const metadata: Metadata = {
  title: "CallToChange",
  description: "LLM Emissions Logger With BlockChain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${quicksand.variable} antialiased bg-[#204544] min-h-screen`}
          style={{ fontFamily: 'var(--font-quicksand)' }}
        >
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
