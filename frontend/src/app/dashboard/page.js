"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { MdCheckCircle, MdHourglassEmpty, MdAutorenew, MdAdd, MdArrowForward } from "react-icons/md";
import { useAuth } from "@/context/AuthContext";
import { tasksAPI } from "@/lib/api";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { formatDate, getStatusColor, getPriorityColor } from "@/lib/utils";

export default function DashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const [stats, setStats] = useState(null);
    const [recentTasks, setRecentTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/login");
        } else if (isAuthenticated) {
            fetchDashboardData();
        }
    }, [authLoading, isAuthenticated, router]);

    const fetchDashboardData = async () => {
        try {
            const [statsResponse, tasksResponse] = await Promise.all([
                tasksAPI.getTaskStats(),
                tasksAPI.getTasks({ sortBy: "createdAt", order: "desc" }),
            ]);

            setStats(statsResponse.data.data);
            setRecentTasks(tasksResponse.data.data.slice(0, 5));
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    const statCards = [
        {
            title: "Total Tasks",
            value: stats?.total || 0,
            icon: <MdAutorenew size={32} />,
            color: "bg-gray-900",
            textColor: "text-gray-900",
        },
        {
            title: "Pending",
            value: stats?.pending || 0,
            icon: <MdHourglassEmpty size={32} />,
            color: "bg-gray-900",
            textColor: "text-gray-700",
        },
        {
            title: "In Progress",
            value: stats?.["in-progress"] || 0,
            icon: <MdAutorenew size={32} />,
            color: "bg-gray-900",
            textColor: "text-gray-900",
        },
        {
            title: "Completed",
            value: stats?.completed || 0,
            icon: <MdCheckCircle size={32} />,
            color: "bg-gray-900",
            textColor: "text-gray-900",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome back, {user?.fullName?.split(" ")[0]}!</h1>
                        </div>
                        <Link href="/tasks" className="w-full sm:w-auto">
                            <Button variant="primary" className="w-full sm:w-auto">
                                <MdAdd size={20} className="mr-2" />
                                New Task
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Grid - 2 columns on mobile, 2 on tablet, 4 on desktop */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8">
                    {statCards.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="hover:border-gray-900 transition-all duration-200">
                                <CardBody className="p-4 sm:p-6">
                                    <div className="flex flex-col gap-3">
                                        <div className={`${stat.color} p-2 sm:p-3 rounded-lg text-white w-fit`}>{stat.icon}</div>
                                        <div>
                                            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                                            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Recent Tasks */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <Card>
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">Recent Tasks</h2>
                            <Link href="/tasks">
                                <Button variant="ghost" size="sm">
                                    View All
                                    <MdArrowForward size={18} className="ml-2" />
                                </Button>
                            </Link>
                        </div>
                        <CardBody className="p-0">
                            {recentTasks.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg mb-4">No tasks yet</p>
                                    <Link href="/tasks">
                                        <Button variant="primary">
                                            <MdAdd size={20} className="mr-2" />
                                            Create Your First Task
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-200">
                                    {recentTasks.map((task) => (
                                        <Link key={task._id} href={`/tasks`} className="block px-6 py-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-base font-medium text-gray-900 truncate mb-1">{task.title}</h3>
                                                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{task.description}</p>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                                                                task.status
                                                            )}`}
                                                        >
                                                            {task.status}
                                                        </span>
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(
                                                                task.priority
                                                            )}`}
                                                        >
                                                            {task.priority}
                                                        </span>
                                                        {task.dueDate && (
                                                            <span className="text-xs text-gray-500">Due: {formatDate(task.dueDate)}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
