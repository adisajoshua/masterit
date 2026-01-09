import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NeumorphicButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
  onMouseLeave?: () => void;
  onTouchStart?: () => void;
  onTouchEnd?: () => void;
  type?: "button" | "submit" | "reset";
}

const NeumorphicButton = forwardRef<HTMLButtonElement, NeumorphicButtonProps>(
  ({ 
    className, 
    variant = "primary", 
    size = "md", 
    isLoading, 
    disabled, 
    children, 
    onClick, 
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    onTouchStart,
    onTouchEnd,
    type = "button" 
  }, ref) => {
    const baseStyles = cn(
      "relative font-display font-semibold transition-all duration-150 rounded-md",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      "gumroad-btn"
    );
    
    const variants = {
      primary: cn(
        "bg-[hsl(var(--accent-yellow))] text-foreground border border-foreground",
        "offset-pink"
      ),
      secondary: cn(
        "bg-[hsl(var(--accent-yellow))] text-foreground border border-foreground",
        "offset-dark"
      ),
      outline: cn(
        "bg-surface text-foreground border border-foreground",
        "offset-dark"
      ),
      ghost: cn(
        "bg-transparent text-foreground border border-transparent hover:border-foreground"
      ),
    };
    
    const sizes = {
      sm: "px-4 py-2 text-small",
      md: "px-6 py-3 text-body",
      lg: "px-8 py-4 text-h3",
    };
    
    const disabledStyles = "opacity-50 cursor-not-allowed pointer-events-none";
    
    return (
      <motion.button
        ref={ref}
        type={type}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          (disabled || isLoading) && disabledStyles,
          className
        )}
        whileHover={disabled ? undefined : { y: -4 }}
        whileTap={disabled ? undefined : { y: 0 }}
        disabled={disabled || isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <motion.span
              className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span>Loading...</span>
          </span>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

NeumorphicButton.displayName = "NeumorphicButton";

export default NeumorphicButton;
