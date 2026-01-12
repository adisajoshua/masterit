import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value?: number;
  max?: number;
  current?: number;
  total?: number;
  segments?: number;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  className?: string;
}

const ProgressBar = ({
  value,
  max = 100,
  current,
  total,
  segments = 10,
  showPercentage = false,
  size = "md",
  animated = true,
  className,
}: ProgressBarProps) => {
  // Support both value/max and current/total APIs
  const percentage = current !== undefined && total !== undefined
    ? Math.min((current / total) * 100, 100)
    : Math.min(((value || 0) / max) * 100, 100);
    
  const filledSegments = Math.ceil((percentage / 100) * segments);
  
  
  const sizes = {
    sm: "h-2",
    md: "h-4",
    lg: "h-6",
  };
  
  return (
    <div className={cn("w-full", className)}>
      <div className={cn(
        "flex gap-1 rounded-sm overflow-hidden border border-foreground bg-surface p-0.5",
        sizes[size]
      )}>
        {Array.from({ length: segments }).map((_, i) => (
          <motion.div
            key={i}
            className={cn(
              "flex-1 rounded-sm transition-colors duration-300",
              i < filledSegments ? "bg-foreground" : "bg-muted"
            )}
            initial={animated ? { scaleY: 0 } : false}
            animate={{ scaleY: 1 }}
            transition={{ delay: animated ? i * 0.05 : 0, duration: 0.3 }}
          />
        ))}
      </div>
      {showPercentage && (
        <motion.p
          className="text-center mt-2 font-mono-display text-small text-foreground"
          initial={animated ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {Math.round(percentage)}%
        </motion.p>
      )}
    </div>
  );
};

export default ProgressBar;
