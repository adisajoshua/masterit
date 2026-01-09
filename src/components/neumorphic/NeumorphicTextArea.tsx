import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";

interface NeumorphicTextAreaProps {
  label?: string;
  maxChars?: number;
  currentChars?: number;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
}

const NeumorphicTextArea = forwardRef<HTMLTextAreaElement, NeumorphicTextAreaProps>(
  ({ className, label, maxChars = 5000, currentChars = 0, placeholder, value, onChange }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const charPercentage = (currentChars / maxChars) * 100;
    
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
            onChange={onChange}
            placeholder={placeholder}
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
          />
          <div className="absolute bottom-3 right-4 flex items-center gap-2">
            <span className={cn(
              "text-micro font-mono-display transition-colors",
              charPercentage > 90 ? "text-alert" : 
              charPercentage > 70 ? "text-orange" : 
              "text-muted-foreground"
            )}>
              {currentChars.toLocaleString()}/{maxChars.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

NeumorphicTextArea.displayName = "NeumorphicTextArea";

export default NeumorphicTextArea;
