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
          "relative p-6 rounded-md transition-all duration-150 cursor-pointer",
          "bg-surface border border-foreground",
          selected && "border-primary border-2 shadow-offset-pink",
          !selected && hoverable && "hover:shadow-soft hover:-translate-y-1",
          className
        )}
        whileHover={hoverable && !selected ? { y: -4 } : undefined}
        whileTap={hoverable ? { scale: 0.98 } : undefined}
      >
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center border-2 border-foreground"
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
                  i <= stars ? "fill-accent-yellow text-accent-yellow" : "text-muted"
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
