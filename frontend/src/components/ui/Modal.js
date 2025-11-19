"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose } from "react-icons/md";

export function Modal({ isOpen, onClose, title, children, size = "md" }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const sizes = {
        sm: "max-w-md",
        md: "max-w-2xl",
        lg: "max-w-4xl",
        xl: "max-w-6xl",
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className={`relative w-full ${sizes[size]} bg-white rounded-xl shadow-2xl`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                                    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                                        <MdClose size={24} />
                                    </button>
                                </div>
                                <div className="px-6 py-4">{children}</div>
                            </motion.div>
                        </div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
