import type { Metadata } from "next";
import { Rye } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar/Navbar";
import Script from "next/script";
import Background from "@/components/Background/Background";
import Footer from "@/components/Footer/Footer";

const rye = Rye({
    weight: "400",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Heads or Tails",
    description: "A simple game of chance",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <Script
                id="next"
                async
                src="https://www.googletagmanager.com/gtag/js?id=G-03Z1EKNG35"
            ></Script>
            <Script id="next">
                {` window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());

                    gtag('config', 'G-03Z1EKNG35');`}
            </Script>
            <body className={`${rye.className} antialiased`}>
                <Background />
                <Navbar />
                {children}
                <Footer />
            </body>
        </html>
    );
}
