import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MessageBoxProps {
  message: string;
  variant?: "solid" | "dotted";
  className?: string;
}

const MessageBox = ({ message, variant = "solid", className }: MessageBoxProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        "w-full max-w-xs px-5 py-4 rounded-xl",
        variant === "solid" 
          ? "bg-surface border border-foreground" 
          : "bg-surface border-2 border-dashed border-coral",
        className
      )}
    >
      <p className="text-sm text-foreground text-center leading-relaxed">
        {message}
      </p>
    </motion.div>
  );
};

export default MessageBox;
