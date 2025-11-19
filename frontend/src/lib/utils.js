import { format, formatDistanceToNow } from "date-fns";

export function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}

export function formatDate(date) {
    if (!date) return "";
    return format(new Date(date), "MMM dd, yyyy");
}

export function formatDateTime(date) {
    if (!date) return "";
    return format(new Date(date), "MMM dd, yyyy HH:mm");
}

export function timeAgo(date) {
    if (!date) return "";
    return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function getPriorityColor(priority) {
    const colors = {
        low: "text-blue-600 bg-blue-50 border-blue-200",
        medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
        high: "text-red-600 bg-red-50 border-red-200",
    };
    return colors[priority] || colors.medium;
}

export function getStatusColor(status) {
    const colors = {
        pending: "text-gray-600 bg-gray-50 border-gray-200",
        "in-progress": "text-purple-600 bg-purple-50 border-purple-200",
        completed: "text-green-600 bg-green-50 border-green-200",
    };
    return colors[status] || colors.pending;
}

export function getStatusIcon(status) {
    const icons = {
        pending: "⏳",
        "in-progress": "🔄",
        completed: "✅",
    };
    return icons[status] || icons.pending;
}

export function getPriorityIcon(priority) {
    const icons = {
        low: "🔵",
        medium: "🟡",
        high: "🔴",
    };
    return icons[priority] || icons.medium;
}

export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

export function validatePassword(password) {
    return password.length >= 6;
}

export function handleError(error) {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }
    if (error.message) {
        return error.message;
    }
    return "An unexpected error occurred";
}
