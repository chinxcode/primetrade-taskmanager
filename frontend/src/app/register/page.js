"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { MdEmail, MdLock, MdPerson, MdAccountCircle } from "react-icons/md";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { validateEmail, validatePassword } from "@/lib/utils";

export default function RegisterPage() {
    const router = useRouter();
    const { register, isAuthenticated } = useAuth();
    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Redirect if already authenticated
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

        // Validation
        if (!validateEmail(formData.email)) {
            setError("Please enter a valid email address");
            setLoading(false);
            return;
        }

        if (!validatePassword(formData.password)) {
            setError("Password must be at least 6 characters long");
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        const result = await register({
            fullName: formData.fullName,
            username: formData.username,
            email: formData.email,
            password: formData.password,
        });

        if (result.success) {
            setSuccess(true);
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-lg mb-4">
                            <MdPerson className="text-white" size={32} />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                        <p className="text-gray-600">Start managing your tasks today</p>
                    </div>

                    {error && (
                        <div className="mb-6">
                            <Alert type="error" message={error} onClose={() => setError("")} />
                        </div>
                    )}

                    {success && (
                        <div className="mb-6">
                            <Alert type="success" message="Account created successfully! Redirecting to login..." />
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <MdPerson className="absolute left-3 top-[42px] text-gray-400" size={20} />
                            <Input
                                label="Full Name"
                                name="fullName"
                                type="text"
                                placeholder="Enter your full name"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="pl-10"
                                required
                            />
                        </div>

                        <div className="relative">
                            <MdAccountCircle className="absolute left-3 top-[42px] text-gray-400" size={20} />
                            <Input
                                label="Username"
                                name="username"
                                type="text"
                                placeholder="Choose a username"
                                value={formData.username}
                                onChange={handleChange}
                                className="pl-10"
                                required
                            />
                        </div>

                        <div className="relative">
                            <MdEmail className="absolute left-3 top-[42px] text-gray-400" size={20} />
                            <Input
                                label="Email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={formData.email}
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
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                className="pl-10"
                                required
                            />
                        </div>

                        <div className="relative">
                            <MdLock className="absolute left-3 top-[42px] text-gray-400" size={20} />
                            <Input
                                label="Confirm Password"
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="pl-10"
                                required
                            />
                        </div>

                        <Button type="submit" variant="primary" className="w-full" loading={loading} disabled={loading || success}>
                            Create Account
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{" "}
                            <Link href="/login" className="text-gray-900 hover:text-gray-700 font-medium underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
