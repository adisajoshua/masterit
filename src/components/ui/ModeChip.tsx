import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Mode = "setup" | "selection" | "teaching" | "evaluation" | "review";

interface ModeChipProps {
  mode: Mode;
  className?: string;
}

const modeConfig: Record<Mode, { label: string; bgColor: string; dotColor: string }> = {
  setup: { 
    label: "Setup", 
    bgColor: "bg-accent-teal/20 text-foreground border border-foreground", 
    dotColor: "bg-accent-teal" 
  },
  selection: { 
    label: "Selection", 
    bgColor: "bg-sky-blue/20 text-foreground border border-foreground", 
    dotColor: "bg-sky-blue" 
  },
  teaching: { 
    label: "Teaching", 
    bgColor: "bg-primary/20 text-foreground border border-foreground", 
    dotColor: "bg-primary" 
  },
  evaluation: { 
    label: "Evaluating", 
    bgColor: "bg-accent-yellow/20 text-foreground border border-foreground", 
    dotColor: "bg-accent-yellow" 
  },
  review: { 
    label: "Review", 
    bgColor: "bg-mint/20 text-foreground border border-foreground", 
    dotColor: "bg-mint" 
  },
};

const ModeChip = ({ mode, className }: ModeChipProps) => {
  const config = modeConfig[mode];
  
  return (
    <motion.div
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-sm font-mono-display text-small font-medium",
        config.bgColor,
        className
      )}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <motion.span
        className={cn("w-2 h-2 rounded-full", config.dotColor)}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {config.label}
    </motion.div>
  );
};

export default ModeChip;
