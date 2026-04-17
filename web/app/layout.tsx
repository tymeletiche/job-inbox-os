import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/nav";

export const metadata: Metadata = {
  title: "Job Inbox OS",
  description: "Turn job-related emails into actionable events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <Nav />
        <main className="max-w-6xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
