import { forwardRef, useState, InputHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface RetroInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  showValidCheck?: boolean;
  isValid?: boolean;
}

const RetroInput = forwardRef<HTMLInputElement, RetroInputProps>(
  ({ className, label, showValidCheck, isValid, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="relative w-full">
        {label && (
          <label className="block text-small font-medium text-muted-foreground mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              "w-full px-6 py-4 text-body font-sans rounded-md",
              "bg-surface border border-foreground transition-all duration-150",
              "placeholder:text-muted-foreground/50",
              "focus:outline-none",
              isFocused && "ring-2 ring-primary border-primary",
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          {showValidCheck && isValid && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <div className="w-6 h-6 rounded-full bg-accent-teal flex items-center justify-center border border-foreground">
                <Check className="w-4 h-4 text-primary-foreground" />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    );
  }
);

RetroInput.displayName = "RetroInput";

export default RetroInput;
