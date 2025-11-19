import { cn } from "@/lib/utils";

export function Input({ label, error, className, type = "text", required, ...props }) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input
                type={type}
                className={cn(
                    "w-full px-4 py-2.5 border rounded-lg transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent",
                    "placeholder:text-gray-400 text-gray-900 bg-white",
                    error ? "border-red-500" : "border-gray-300",
                    className
                )}
                {...props}
            />
            {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
        </div>
    );
}

export function TextArea({ label, error, className, rows = 4, required, ...props }) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <textarea
                rows={rows}
                className={cn(
                    "w-full px-4 py-2.5 border rounded-lg transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent",
                    "placeholder:text-gray-400 text-gray-900 bg-white resize-none",
                    error ? "border-red-500" : "border-gray-300",
                    className
                )}
                {...props}
            />
            {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
        </div>
    );
}

export function Select({ label, error, className, children, required, ...props }) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <select
                className={cn(
                    "w-full px-4 py-2.5 border rounded-lg transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent",
                    "bg-white text-gray-900",
                    error ? "border-red-500" : "border-gray-300",
                    className
                )}
                {...props}
            >
                {children}
            </select>
            {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
        </div>
    );
}
