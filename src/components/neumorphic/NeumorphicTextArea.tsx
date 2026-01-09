import { forwardRef, useState, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface NeumorphicTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  showCount?: boolean;
}

const NeumorphicTextArea = forwardRef<HTMLTextAreaElement, NeumorphicTextAreaProps>(
  ({ className, label, showCount, maxLength, value, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const charCount = typeof value === 'string' ? value.length : 0;
    const charPercentage = maxLength ? (charCount / maxLength) * 100 : 0;
    
    return (
      <div className="relative w-full">
        {label && (
          <label className="block text-small font-medium text-muted-foreground mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            value={value}
            maxLength={maxLength}
            className={cn(
              "w-full px-6 py-4 text-body font-sans rounded-xl min-h-[200px] resize-none",
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
          {showCount && maxLength && (
            <div className="absolute bottom-3 right-4 flex items-center gap-2">
              <span className={cn(
                "text-micro font-mono-display transition-colors",
                charPercentage > 90 ? "text-alert" : 
                charPercentage > 70 ? "text-orange" : 
                "text-muted-foreground"
              )}>
                {charCount.toLocaleString()}/{maxLength.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
);

NeumorphicTextArea.displayName = "NeumorphicTextArea";

export default NeumorphicTextArea;
