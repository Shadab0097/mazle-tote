import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
    title: "Mazle Tote - Premium Handcrafted Tote Bags",
    description: "Discover our collection of beautifully designed, high-quality tote bags with vibrant sublimation printing. Perfect for shopping, events, and everyday use.",
    keywords: "tote bags, canvas bags, handcrafted bags, sublimation printing, eco-friendly bags, reusable bags",
    openGraph: {
        title: "Mazle Tote - Premium Handcrafted Tote Bags",
        description: "Discover our collection of beautifully designed, high-quality tote bags.",
        type: "website",
        images: ["/logo.png"],
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
