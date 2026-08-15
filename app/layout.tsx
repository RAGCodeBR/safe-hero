import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") || "safe-hero-app.arthuroscorpion.chatgpt.site";
  const protocol = host.includes("localhost") ? "http" : "https";
  const imageUrl = `${protocol}://${host}/og.png`;

  return {
    title: "Safe Hero — Seu cofre digital",
    description: "Gerencie senhas e acessos com segurança, clareza e praticidade.",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "Safe Hero — Seu cofre digital",
      description: "Seus acessos, sempre seguros.",
      images: [{ url: imageUrl, width: 1733, height: 909, alt: "Safe Hero — Seus acessos. Sempre seguros." }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Safe Hero — Seu cofre digital",
      description: "Seus acessos, sempre seguros.",
      images: [imageUrl],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
