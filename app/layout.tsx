import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { ToastProvider } from "@/components/providers/toast-provider";
import { Footer } from "@/components/footer/footer";
import { messages } from "@/lib/messages";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://maketheprint.store";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Make The Print",
  description:
    "Descoperă colecția noastră de produse printate 3D de calitate.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider />
          <div className="min-h-screen flex flex-col">
            {children}
            <Footer messages={messages} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
