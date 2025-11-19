import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const metadata = {
    title: "TaskMaster - Manage Your Tasks Efficiently",
    description: "A modern task management application with a beautiful UI",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className="hydrated">
            <body className={`${inter.variable} font-sans antialiased`}>
                <AuthProvider>
                    <Navbar />
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
