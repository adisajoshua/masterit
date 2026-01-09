import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Mode = "setup" | "selection" | "teaching" | "evaluation" | "review";

interface ModeChipProps {
  mode: Mode;
  className?: string;
}

const modeConfig: Record<Mode, { label: string; color: string; bgColor: string }> = {
  setup: { label: "Setup", color: "text-turquoise", bgColor: "bg-turquoise/20" },
  selection: { label: "Selection", color: "text-sky-blue", bgColor: "bg-sky-blue/20" },
  teaching: { label: "Teaching", color: "text-coral", bgColor: "bg-coral/20" },
  evaluation: { label: "Evaluating", color: "text-gold", bgColor: "bg-gold/20" },
  review: { label: "Review", color: "text-mint", bgColor: "bg-mint/20" },
};

const ModeChip = ({ mode, className }: ModeChipProps) => {
  const config = modeConfig[mode];
  
  return (
    <motion.div
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono-display text-small font-medium",
        config.bgColor,
        config.color,
        className
      )}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <motion.span
        className={cn("w-2 h-2 rounded-full", config.color.replace("text-", "bg-"))}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {config.label}
    </motion.div>
  );
};

export default ModeChip;
