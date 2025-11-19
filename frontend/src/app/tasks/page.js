"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MdAdd, MdEdit, MdDelete, MdSearch, MdFilterList, MdSort } from "react-icons/md";
import { useAuth } from "@/context/AuthContext";
import { tasksAPI } from "@/lib/api";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, TextArea, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { Alert } from "@/components/ui/Alert";
import { formatDate, getStatusColor, getPriorityColor, handleError } from "@/lib/utils";

export default function TasksPage() {
    const router = useRouter();
    const { isAuthenticated, loading: authLoading } = useAuth();

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        dueDate: "",
    });

    // Filter and search state
    const [filters, setFilters] = useState({
        search: "",
        status: "",
        priority: "",
        sortBy: "createdAt",
        order: "desc",
    });

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/login");
        } else if (isAuthenticated) {
            fetchTasks();
        }
    }, [authLoading, isAuthenticated, router, filters]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const params = {};
            if (filters.search) params.search = filters.search;
            if (filters.status) params.status = filters.status;
            if (filters.priority) params.priority = filters.priority;
            params.sortBy = filters.sortBy;
            params.order = filters.order;

            const response = await tasksAPI.getTasks(params);
            setTasks(response.data.data);
        } catch (err) {
            setError(handleError(err));
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (task = null) => {
        if (task) {
            setEditingTask(task);
            setFormData({
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
            });
        } else {
            setEditingTask(null);
            setFormData({
                title: "",
                description: "",
                status: "pending",
                priority: "medium",
                dueDate: "",
            });
        }
        setIsModalOpen(true);
        setError("");
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTask(null);
        setFormData({
            title: "",
            description: "",
            status: "pending",
            priority: "medium",
            dueDate: "",
        });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const taskData = {
                ...formData,
                dueDate: formData.dueDate || null,
            };

            if (editingTask) {
                await tasksAPI.updateTask(editingTask._id, taskData);
                setSuccess("Task updated successfully!");
            } else {
                await tasksAPI.createTask(taskData);
                setSuccess("Task created successfully!");
            }

            handleCloseModal();
            fetchTasks();
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(handleError(err));
        }
    };

    const handleDelete = async (taskId) => {
        if (!confirm("Are you sure you want to delete this task?")) return;

        try {
            await tasksAPI.deleteTask(taskId);
            setSuccess("Task deleted successfully!");
            fetchTasks();
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(handleError(err));
        }
    };

    const handleStatusChange = async (taskId, currentStatus) => {
        let newStatus;
        if (currentStatus === "pending") newStatus = "in-progress";
        else if (currentStatus === "in-progress") newStatus = "completed";
        else return; // Already completed

        try {
            await tasksAPI.updateTask(taskId, { status: newStatus });
            setSuccess(`Task moved to ${newStatus}!`);
            fetchTasks();
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(handleError(err));
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters({ ...filters, [key]: value });
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tasks</h1>
                        </div>
                        <Button variant="primary" onClick={() => handleOpenModal()} className="w-full sm:w-auto">
                            <MdAdd size={20} className="mr-2" />
                            New Task
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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

                {/* Filters */}
                <Card className="mb-6">
                    <CardBody className="p-4">
                        <div className="space-y-4">
                            {/* Search - Full width on mobile */}
                            <div className="relative">
                                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange("search", e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                                />
                            </div>

                            {/* Filters Grid - 2 columns on mobile, 3 on tablet, all on desktop */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                <select
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange("status", e.target.value)}
                                    className="px-3 py-2.5 border text-gray-900 bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                                >
                                    <option value="">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>

                                <select
                                    value={filters.priority}
                                    onChange={(e) => handleFilterChange("priority", e.target.value)}
                                    className="px-3 py-2.5 border text-gray-900 bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                                >
                                    <option value="">All Priority</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>

                                <select
                                    value={`${filters.sortBy}-${filters.order}`}
                                    onChange={(e) => {
                                        const [sortBy, order] = e.target.value.split("-");
                                        setFilters({ ...filters, sortBy, order });
                                    }}
                                    className="px-3 py-2.5 border border-gray-300 text-gray-900 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm col-span-2 md:col-span-1"
                                >
                                    <option value="createdAt-desc">Newest First</option>
                                    <option value="createdAt-asc">Oldest First</option>
                                    <option value="dueDate-asc">Due Date (Earliest)</option>
                                    <option value="dueDate-desc">Due Date (Latest)</option>
                                    <option value="priority-desc">Priority (High-Low)</option>
                                </select>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Tasks Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                ) : tasks.length === 0 ? (
                    <Card>
                        <CardBody className="text-center py-12">
                            <p className="text-gray-500 text-lg mb-4">No tasks found</p>
                            <Button variant="primary" onClick={() => handleOpenModal()}>
                                <MdAdd size={20} className="mr-2" />
                                Create Your First Task
                            </Button>
                        </CardBody>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence>
                            {tasks.map((task, index) => (
                                <motion.div
                                    key={task._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: index * 0.03 }}
                                    className="group"
                                >
                                    <div className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200">
                                        <div className="p-4 sm:p-5">
                                            <div className="flex flex-col sm:flex-row gap-4">
                                                {/* Left Section - Status & Priority */}
                                                <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 shrink-0">
                                                    {/* Priority Badge */}
                                                    <div
                                                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center font-bold text-white ${
                                                            task.priority === "high"
                                                                ? "bg-red-500"
                                                                : task.priority === "medium"
                                                                ? "bg-yellow-500"
                                                                : "bg-blue-500"
                                                        }`}
                                                    >
                                                        {task.priority === "high" ? "!" : task.priority === "medium" ? "•" : "◦"}
                                                    </div>

                                                    {/* Status Badge */}
                                                    <div className="flex sm:flex-col gap-2">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(
                                                                task.status
                                                            )}`}
                                                        >
                                                            {task.status}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Middle Section - Content */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
                                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>

                                                    {/* Due Date */}
                                                    {task.dueDate && (
                                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                />
                                                            </svg>
                                                            <span>Due {formatDate(task.dueDate)}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Right Section - Actions */}
                                                <div className="flex sm:flex-col gap-2 shrink-0">
                                                    {/* Status Change Button */}
                                                    {task.status !== "completed" && (
                                                        <button
                                                            onClick={() => handleStatusChange(task._id, task.status)}
                                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                                task.status === "pending"
                                                                    ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                                                                    : "bg-green-50 text-green-700 hover:bg-green-100"
                                                            }`}
                                                            title={task.status === "pending" ? "Start Task" : "Complete Task"}
                                                        >
                                                            {task.status === "pending" ? "Start →" : "Complete ✓"}
                                                        </button>
                                                    )}

                                                    {/* Edit Button */}
                                                    <button
                                                        onClick={() => handleOpenModal(task)}
                                                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                                        title="Edit task"
                                                    >
                                                        <MdEdit size={20} />
                                                    </button>

                                                    {/* Delete Button */}
                                                    <button
                                                        onClick={() => handleDelete(task._id)}
                                                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete task"
                                                    >
                                                        <MdDelete size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Task Modal */}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingTask ? "Edit Task" : "Create New Task"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <Alert type="error" message={error} />}

                    <Input
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter task title"
                        required
                    />

                    <TextArea
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Enter task description"
                        rows={4}
                        required
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Select
                            label="Status"
                            name="status"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </Select>

                        <Select
                            label="Priority"
                            name="priority"
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </Select>
                    </div>

                    <Input
                        label="Due Date"
                        name="dueDate"
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    />

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button type="submit" variant="primary" className="flex-1">
                            {editingTask ? "Update Task" : "Create Task"}
                        </Button>
                        <Button type="button" variant="secondary" onClick={handleCloseModal} className="flex-1">
                            Cancel
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
