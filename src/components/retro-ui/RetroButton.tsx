import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RetroButtonProps {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
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

const RetroButton = forwardRef<HTMLButtonElement, RetroButtonProps>(
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
    const isDisabled = disabled || isLoading;

    // Offset class goes on WRAPPER, not face
    const offsetClass = {
      primary: "offset-pink",
      outline: "offset-dark",
      ghost: "",
    }[variant];

    // Face styles (background, border, text)
    const faceStyles = {
      primary: "bg-[hsl(var(--accent-yellow))] text-foreground border border-foreground",
      outline: "bg-surface text-foreground border border-foreground",
      ghost: "bg-transparent text-foreground border border-transparent hover:border-foreground",
    }[variant];

    const sizes = {
      sm: "px-4 py-2 text-small",
      md: "px-6 py-3 text-body",
      lg: "px-8 py-4 text-h3",
      icon: "h-10 w-10 p-0",
    };

    return (
      // WRAPPER - stationary, owns offset pseudo-element
      <div
        className={cn(
          "gumroad-btn-wrap inline-flex rounded-md",
          offsetClass,
          className
        )}
        data-disabled={isDisabled}
      >
        {/* FACE - moves on hover via Framer Motion */}
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
            "gumroad-btn-face rounded-md font-display font-semibold transition-colors",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            faceStyles,
            sizes[size],
            isDisabled && "opacity-50 cursor-not-allowed"
          )}
          whileHover={isDisabled ? undefined : { y: -4 }}
          whileTap={isDisabled ? undefined : { y: 0 }}
          disabled={isDisabled}
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
            <span className="flex items-center justify-center gap-2">
              {children}
            </span>
          )}
        </motion.button>
      </div>
    );
  }
);

RetroButton.displayName = "RetroButton";

export default RetroButton;
