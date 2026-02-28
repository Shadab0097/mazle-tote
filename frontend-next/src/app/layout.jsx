import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
});

const playfair = Playfair_Display({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-heading",
    weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://mazeltote.com"),
    title: {
        default: "Mazel Tote — Premium Handcrafted Tote Bags",
        template: "%s | Mazel Tote",
    },
    description:
        "Discover our collection of beautifully designed, high-quality tote bags with vibrant sublimation printing. Perfect for shopping, events, and everyday use.",
    keywords: [
        "tote bags",
        "canvas bags",
        "handcrafted bags",
        "sublimation printing",
        "eco-friendly bags",
        "reusable bags",
        "Mazel Tote",
    ],
    openGraph: {
        title: "Mazel Tote — Premium Handcrafted Tote Bags",
        description:
            "Discover our collection of beautifully designed, high-quality tote bags.",
        type: "website",
        siteName: "Mazel Tote",
        images: [{ url: "/logo.png", width: 512, height: 512, alt: "Mazel Tote Logo" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Mazel Tote — Premium Handcrafted Tote Bags",
        description:
            "Discover our collection of beautifully designed, high-quality tote bags.",
        images: ["/logo.png"],
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
            <head>
                <link rel="preconnect" href="https://res.cloudinary.com" />
                <link rel="dns-prefetch" href="https://res.cloudinary.com" />
            </head>
            <body className="font-sans antialiased">
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
