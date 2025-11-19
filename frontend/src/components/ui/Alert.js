"use client";

import { motion } from "framer-motion";
import { MdCheckCircle, MdError, MdInfo, MdWarning, MdClose } from "react-icons/md";

export function Alert({ type = "info", message, onClose }) {
    const types = {
        success: {
            bg: "bg-green-50",
            border: "border-green-200",
            text: "text-green-800",
            icon: <MdCheckCircle className="text-green-500" size={20} />,
        },
        error: {
            bg: "bg-red-50",
            border: "border-red-200",
            text: "text-red-800",
            icon: <MdError className="text-red-500" size={20} />,
        },
        warning: {
            bg: "bg-yellow-50",
            border: "border-yellow-200",
            text: "text-yellow-800",
            icon: <MdWarning className="text-yellow-500" size={20} />,
        },
        info: {
            bg: "bg-blue-50",
            border: "border-blue-200",
            text: "text-blue-800",
            icon: <MdInfo className="text-blue-500" size={20} />,
        },
    };

    const config = types[type];

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${config.bg} ${config.border}`}
        >
            {config.icon}
            <p className={`flex-1 text-sm font-medium ${config.text}`}>{message}</p>
            {onClose && (
                <button onClick={onClose} className={`${config.text} hover:opacity-70 transition-opacity`}>
                    <MdClose size={18} />
                </button>
            )}
        </motion.div>
    );
}
