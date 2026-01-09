import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  segments?: number;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  className?: string;
}

const ProgressBar = ({
  value,
  max = 100,
  segments = 10,
  showPercentage = false,
  size = "md",
  animated = true,
  className,
}: ProgressBarProps) => {
  const percentage = Math.min((value / max) * 100, 100);
  const filledSegments = Math.ceil((percentage / 100) * segments);
  
  const getColor = (percent: number) => {
    if (percent >= 80) return "bg-turquoise";
    if (percent >= 50) return "bg-gold";
    return "bg-coral";
  };
  
  const sizes = {
    sm: "h-2",
    md: "h-4",
    lg: "h-6",
  };
  
  return (
    <div className={cn("w-full", className)}>
      <div className={cn("flex gap-1 rounded-lg overflow-hidden", sizes[size])}>
        {Array.from({ length: segments }).map((_, i) => (
          <motion.div
            key={i}
            className={cn(
              "flex-1 rounded-sm transition-colors duration-300",
              i < filledSegments ? getColor(percentage) : "bg-muted"
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
