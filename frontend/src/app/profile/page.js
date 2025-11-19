"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MdPerson, MdEmail, MdLock, MdSave } from "react-icons/md";
import { useAuth } from "@/context/AuthContext";
import { authAPI } from "@/lib/api";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { Alert } from "@/components/ui/Alert";
import { handleError, validateEmail } from "@/lib/utils";

export default function ProfilePage() {
    const router = useRouter();
    const { user, updateUser, isAuthenticated, loading: authLoading } = useAuth();

    const [profileData, setProfileData] = useState({
        fullName: "",
        email: "",
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/login");
        } else if (user) {
            setProfileData({
                fullName: user.fullName || "",
                email: user.email || "",
            });
        }
    }, [authLoading, isAuthenticated, user, router]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (!validateEmail(profileData.email)) {
            setError("Please enter a valid email address");
            setLoading(false);
            return;
        }

        try {
            const response = await authAPI.updateProfile(profileData);
            updateUser(response.data.data);
            setSuccess("Profile updated successfully!");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(handleError(err));
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError("New passwords do not match");
            setLoading(false);
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError("Password must be at least 6 characters long");
            setLoading(false);
            return;
        }

        try {
            await authAPI.changePassword({
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword,
            });
            setSuccess("Password changed successfully!");
            setPasswordData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(handleError(err));
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Profile Settings</h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
                {/* Alerts */}
                {success && (
                    <div className="mb-6">
                        <Alert type="success" message={success} onClose={() => setSuccess("")} />
                    </div>
                )}

                {error && (
                    <div className="mb-6">
                        <Alert type="error" message={error} onClose={() => setError("")} />
                    </div>
                )}

                {/* Profile Information */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card>
                        <CardHeader className="p-4 sm:p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 rounded-lg shrink-0">
                                    <MdPerson size={20} className="text-gray-900 sm:w-6 sm:h-6" />
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Profile Information</h2>
                                    <p className="text-xs sm:text-sm text-gray-600">Update your account details</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody className="p-4 sm:p-6">
                            <form onSubmit={handleProfileUpdate} className="space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-900 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold shrink-0">
                                        {user?.fullName?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs sm:text-sm text-gray-600">Username</p>
                                        <p className="font-medium text-gray-900 truncate">@{user?.username}</p>
                                    </div>
                                </div>

                                <Input
                                    label="Full Name"
                                    name="fullName"
                                    value={profileData.fullName}
                                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                    placeholder="Enter your full name"
                                    required
                                />

                                <Input
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                    placeholder="Enter your email"
                                    required
                                />

                                <Button type="submit" variant="primary" loading={loading} disabled={loading}>
                                    <MdSave size={20} className="mr-2" />
                                    Save Changes
                                </Button>
                            </form>
                        </CardBody>
                    </Card>
                </motion.div>

                {/* Change Password */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card>
                        <CardHeader className="p-4 sm:p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 rounded-lg shrink-0">
                                    <MdLock size={20} className="text-gray-900 sm:w-6 sm:h-6" />
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Change Password</h2>
                                    <p className="text-xs sm:text-sm text-gray-600">Update your password to keep your account secure</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody className="p-4 sm:p-6">
                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                <Input
                                    label="Current Password"
                                    name="oldPassword"
                                    type="password"
                                    value={passwordData.oldPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                    placeholder="Enter current password"
                                    required
                                />

                                <Input
                                    label="New Password"
                                    name="newPassword"
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    placeholder="Enter new password"
                                    required
                                />

                                <Input
                                    label="Confirm New Password"
                                    name="confirmPassword"
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    placeholder="Confirm new password"
                                    required
                                />

                                <Button type="submit" variant="primary" loading={loading} disabled={loading}>
                                    <MdLock size={20} className="mr-2" />
                                    Update Password
                                </Button>
                            </form>
                        </CardBody>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
