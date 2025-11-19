"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { MdCheckCircle, MdAutorenew, MdSecurity, MdSpeed, MdTask } from "react-icons/md";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

export default function Home() {
    const router = useRouter();
    const { isAuthenticated, loading } = useAuth();

    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.push("/dashboard");
        }
    }, [isAuthenticated, loading, router]);

    const features = [
        {
            icon: <MdCheckCircle size={32} />,
            title: "Task Management",
            description: "Create, organize, and track your tasks efficiently",
        },
        {
            icon: <MdAutorenew size={32} />,
            title: "Real-time Updates",
            description: "Stay synchronized across all your devices",
        },
        {
            icon: <MdSecurity size={32} />,
            title: "Secure & Private",
            description: "Your data is encrypted and protected",
        },
        {
            icon: <MdSpeed size={32} />,
            title: "Fast & Responsive",
            description: "Lightning-fast performance on any device",
        },
    ];

    return (
        <div>
            <div className="min-h-screen flex flex-col bg-white">
                {/* Hero Section */}
                <div className="flex-1 flex items-center justify-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-900 rounded-2xl mb-8 shadow-sm">
                            <MdTask className="text-white" size={40} />
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                            Welcome to <span className="text-gray-900">TaskMaster</span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                            The modern task management solution that helps you stay organized, productive, and in control of your work.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register">
                                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                                    Sign Up
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Footer */}
                <footer className="border-t border-gray-200 py-8 flex bottom-0 w-full">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
                        <p>Made by Sachin Sharma</p>
                    </div>
                </footer>
            </div>
        </div>
    );
}
