import { cn } from "@/lib/utils";

export function Card({ children, className, ...props }) {
    return (
        <div className={cn("bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden", className)} {...props}>
            {children}
        </div>
    );
}

export function CardHeader({ children, className, ...props }) {
    return (
        <div className={cn("px-6 py-4 border-b border-gray-200", className)} {...props}>
            {children}
        </div>
    );
}

export function CardBody({ children, className, ...props }) {
    return (
        <div className={cn("px-6 py-4", className)} {...props}>
            {children}
        </div>
    );
}

export function CardFooter({ children, className, ...props }) {
    return (
        <div className={cn("px-6 py-4 bg-gray-50 border-t border-gray-200", className)} {...props}>
            {children}
        </div>
    );
}
