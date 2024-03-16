"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Inter } from "next/font/google";
import { BrowserRouter } from "react-router-dom";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <body
            className={`${inter.className} bg-zinc-950 text-zinc-50 antialiased`}
          >
            {children}
          </body>
        </BrowserRouter>
      </QueryClientProvider>
    </html>
  );
}
