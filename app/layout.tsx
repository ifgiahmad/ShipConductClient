import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { ThemeProvider } from "@/components/providers/ThemeProviders";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Shipconduct",
  description: "Aplikasi Penilaian Kapal",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Shipconduct App",
    description: "Aplikasi Penilaian Kapal",
    url: "https://shipconduct.lintasmaritim.com/",
    siteName: "Shipconduct App",
    images: [
      {
        url: "https://shipconduct.lintasmaritim.com/logo.png", // ganti dengan gambar sebenarnya
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shipconduct App",
    description: "Aplikasi Penilaian Kapal",
    images: ["https://shipconduct.lintasmaritim.com/logo.png"],
  },
};

/* export const metadata: Metadata = {
  title: "Shipconduct App",
  description: "Aplikasi Penilaian Kapal",
   icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Shipconduct App",
    description: "Aplikasi Penilaian Kapal",
    url: "https://shipconduct.lintasmaritim.com/",
    siteName: "Shipconduct App",
    images: [
      {
        url: "/favicon.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
}; */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          storageKey="dashboard-theme"
        >
          <div> {children}</div>
        </ThemeProvider> */}
        <div> {children}</div>
      </body>
    </html>
  );
}
