"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { MdEmail, MdLock } from "react-icons/md";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";

export default function LoginPage() {
    const router = useRouter();
    const { login, isAuthenticated } = useAuth();
    const [formData, setFormData] = useState({
        username: "test",
        password: "test123",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (isAuthenticated) {
        router.push("/dashboard");
        return null;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await login(formData);

        if (result.success) {
            router.push("/dashboard");
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-lg mb-4">
                            <MdLock className="text-white" size={32} />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                        <p className="text-gray-600">Sign in to manage your tasks</p>
                    </div>

                    {error && (
                        <div className="mb-6">
                            <Alert type="error" message={error} onClose={() => setError("")} />
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative">
                            <MdEmail className="absolute left-3 top-[42px] text-gray-400" size={20} />
                            <Input
                                label="Username"
                                name="username"
                                type="text"
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={handleChange}
                                className="pl-10"
                                required
                            />
                        </div>

                        <div className="relative">
                            <MdLock className="absolute left-3 top-[42px] text-gray-400" size={20} />
                            <Input
                                label="Password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                className="pl-10"
                                required
                            />
                        </div>

                        <Button type="submit" variant="primary" className="w-full" loading={loading} disabled={loading}>
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{" "}
                            <Link href="/register" className="text-gray-900 hover:text-gray-700 font-medium underline">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
