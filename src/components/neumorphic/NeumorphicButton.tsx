import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NeumorphicButtonProps {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  pulse?: boolean;
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
    pulse, 
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
    const baseStyles = "relative font-display font-semibold transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/50";
    
    const variants = {
      primary: "bg-coral text-primary-foreground hover:bg-coral-dark active:bg-coral-dark",
      secondary: "bg-turquoise text-secondary-foreground hover:bg-turquoise-dark active:bg-turquoise-dark",
      ghost: "bg-surface text-foreground neu-flat hover:neu-hover active:neu-pressed",
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
          pulse && !disabled && "pulse-glow",
          variant !== "ghost" && "shadow-lg hover:shadow-xl active:shadow-md",
          className
        )}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
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
