import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";

interface XPCounterProps {
  value: number;
  streak?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const XPCounter = ({ value, streak = 0, size = "md", className }: XPCounterProps) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [floatingXP, setFloatingXP] = useState<number | null>(null);
  
  useEffect(() => {
    if (value !== displayValue) {
      const diff = value - displayValue;
      if (diff > 0) {
        setFloatingXP(diff);
        setTimeout(() => setFloatingXP(null), 1000);
      }
      
      // Animate counter
      const duration = 500;
      const startTime = Date.now();
      const startValue = displayValue;
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(Math.round(startValue + (value - startValue) * eased));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [value]);
  
  const sizes = {
    sm: "text-small",
    md: "text-body",
    lg: "text-h3",
  };
  
  return (
    <div className={cn("relative flex items-center gap-2", className)}>
      <div className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-sm",
        "bg-accent-yellow/20 text-foreground font-mono-display font-bold border border-foreground",
        sizes[size]
      )}>
        <Flame className={cn(
          "text-accent-coral",
          size === "sm" ? "w-4 h-4" : size === "md" ? "w-5 h-5" : "w-6 h-6"
        )} />
        <motion.span
          key={displayValue}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {displayValue.toLocaleString()}
        </motion.span>
        <span className="text-muted-foreground font-normal">XP</span>
      </div>
      
      {streak > 0 && (
        <div className="flex items-center gap-1 px-2 py-1 rounded-sm bg-accent-coral/20 text-accent-coral text-micro font-medium border border-foreground">
          {Array.from({ length: Math.min(streak, 5) }).map((_, i) => (
            <Flame key={i} className="w-3 h-3" />
          ))}
          <span>{streak}d</span>
        </div>
      )}
      
      <AnimatePresence>
        {floatingXP && (
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -30 }}
            exit={{ opacity: 0 }}
            className="absolute -top-2 left-1/2 -translate-x-1/2 text-accent-yellow font-bold text-small"
          >
            +{floatingXP}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default XPCounter;
