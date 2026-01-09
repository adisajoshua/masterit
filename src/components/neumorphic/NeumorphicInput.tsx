import { forwardRef, useState, InputHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface NeumorphicInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  showValidCheck?: boolean;
  isValid?: boolean;
}

const NeumorphicInput = forwardRef<HTMLInputElement, NeumorphicInputProps>(
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
              "w-full px-6 py-4 text-body font-sans rounded-xl",
              "bg-background transition-all duration-200",
              "neu-pressed",
              "placeholder:text-muted-foreground/50",
              "focus:outline-none",
              isFocused && "ring-2 ring-coral/50 shadow-[0_0_20px_hsl(var(--coral)/0.2)]",
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
              <div className="w-6 h-6 rounded-full bg-turquoise flex items-center justify-center">
                <Check className="w-4 h-4 text-primary-foreground" />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    );
  }
);

NeumorphicInput.displayName = "NeumorphicInput";

export default NeumorphicInput;
