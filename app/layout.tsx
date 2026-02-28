import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { ToastProvider } from "@/components/providers/toast-provider";
import { Footer } from "@/components/footer/footer";
import { messages } from "@/lib/messages";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Make The Print - Produse printate 3D de calitate",
  description:
    "Descoperă colecția noastră de produse printate 3D de calitate. De la prototipuri funcționale la creații artistice, aducem precizie și inovație în fiecare print.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
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
