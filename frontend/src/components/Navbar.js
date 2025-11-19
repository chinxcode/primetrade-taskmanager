"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MdDashboard, MdTask, MdPerson, MdLogout, MdMenu, MdClose } from "react-icons/md";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout, isAuthenticated } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigation = [
        { name: "Dashboard", href: "/dashboard", icon: MdDashboard },
        { name: "Tasks", href: "/tasks", icon: MdTask },
        { name: "Profile", href: "/profile", icon: MdPerson },
    ];

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    // Don't show navbar on auth pages
    if (!isAuthenticated || pathname === "/login" || pathname === "/register") {
        return null;
    }

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                            <MdTask className="text-white" size={20} />
                        </div>
                        <span className="text-xl font-bold text-gray-900 hidden sm:block">TaskMaster</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`relative px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                                        isActive ? "text-gray-900 bg-gray-100" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                                >
                                    <Icon size={20} />
                                    {item.name}
                                    {isActive && (
                                        <motion.div
                                            layoutId="navbar-indicator"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* User Menu */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="flex items-center gap-3 px-3 py-1.5 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                {user?.fullName?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{user?.fullName?.split(" ")[0]}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-600 hover:bg-gray-100">
                            <MdLogout size={20} />
                        </Button>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                    >
                        {isMobileMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="md:hidden border-t border-gray-200 bg-white"
                >
                    <div className="px-4 py-3 space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium ${
                                        isActive ? "text-gray-900 bg-gray-100" : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    <Icon size={20} />
                                    {item.name}
                                </Link>
                            );
                        })}
                        <button
                            onClick={() => {
                                handleLogout();
                                setIsMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100"
                        >
                            <MdLogout size={20} />
                            Logout
                        </button>
                    </div>
                </motion.div>
            )}
        </nav>
    );
}
