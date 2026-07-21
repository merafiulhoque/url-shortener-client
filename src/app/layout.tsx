import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/providers/QueryProvider";
import { ToastProvider } from "@/components/Toast";


export const metadata: Metadata = {
  title: "URL shortener",
  description: "Shorten Long URLs efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <ToastProvider>
            {children}
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
