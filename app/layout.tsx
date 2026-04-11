import type {Metadata} from "next";
import {ThemeProvider} from "next-themes";
import {ToastProvider} from "@/components/providers/toast-provider";
import {Footer} from "@/components/footer/footer";
import {messages} from "@/lib/messages";
import {getSiteOrigin} from "@/lib/site-url";
import "./globals.css";

const defaultTitle = "Make The Print";
const defaultDescription = "Descoperă colecția noastră de produse printate 3D de calitate.";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteOrigin()),
  title: defaultTitle,
  description: defaultDescription,
  manifest: "/manifest.json",
  icons: {
    apple: "/smallIcon.png",
  },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: "/",
    siteName: defaultTitle,
    title: defaultTitle,
    description: defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
  },
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ro"
      suppressHydrationWarning
    >
    <body className="font-sans antialiased">
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ToastProvider/>
      <div className="min-h-screen flex flex-col">
        {children}
        <Footer messages={messages}/>
      </div>
    </ThemeProvider>
    </body>
    </html>
  );
}
