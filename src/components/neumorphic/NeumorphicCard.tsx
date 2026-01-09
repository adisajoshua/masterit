import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check, Star } from "lucide-react";

interface NeumorphicCardProps {
  selected?: boolean;
  stars?: number;
  hoverable?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

const NeumorphicCard = forwardRef<HTMLDivElement, NeumorphicCardProps>(
  ({ className, selected, stars, hoverable = true, children, onClick }, ref) => {
    return (
      <motion.div
        ref={ref}
        onClick={onClick}
        className={cn(
          "relative p-6 rounded-2xl transition-all duration-200 cursor-pointer",
          "neu-flat",
          selected && "ring-4 ring-coral shadow-[0_0_20px_hsl(var(--coral)/0.3)]",
          className
        )}
        whileHover={hoverable ? { y: -4, scale: 1.02 } : undefined}
        whileTap={hoverable ? { scale: 0.98 } : undefined}
      >
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-coral flex items-center justify-center shadow-lg"
          >
            <Check className="w-5 h-5 text-primary-foreground" />
          </motion.div>
        )}
        
        {stars !== undefined && (
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={cn(
                  "w-4 h-4 transition-colors",
                  i <= stars ? "fill-gold text-gold" : "text-muted"
                )}
              />
            ))}
          </div>
        )}
        
        {children}
      </motion.div>
    );
  }
);

NeumorphicCard.displayName = "NeumorphicCard";

export default NeumorphicCard;
