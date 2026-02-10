import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MessageBoxProps {
  message?: string;
  variant?: "solid" | "dotted";
  className?: string;
  children?: React.ReactNode;
}

const MessageBox = ({ message, variant = "solid", className, children }: MessageBoxProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        "w-full max-w-xs px-5 py-4 rounded-xl flex flex-col gap-3",
        variant === "solid"
          ? "bg-surface border border-foreground"
          : "bg-surface border-2 border-dashed border-coral",
        className
      )}
    >
      {message && (
        <p className="text-sm text-foreground text-center leading-relaxed">
          {message}
        </p>
      )}
      {children}
    </motion.div>
  );
};

export default MessageBox;
