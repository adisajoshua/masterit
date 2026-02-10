
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export type DifficultyLevel = "basic" | "intermediate" | "advanced";

interface DifficultyIndicatorProps {
    level: DifficultyLevel
    showLabel?: boolean
    showChange?: boolean
    previousLevel?: DifficultyLevel
    explanation?: string
    className?: string
}

export function DifficultyIndicator({
    level,
    showLabel = true,
    showChange = false,
    previousLevel,
    explanation,
    className,
}: DifficultyIndicatorProps) {

    const difficultyConfig = {
        basic: {
            label: "Basic",
            color: "bg-[hsl(var(--accent-teal))] border-foreground",
            textColor: "text-foreground",
            icon: "🌱",
            description: "Foundational concepts",
        },
        intermediate: {
            label: "Intermediate",
            color: "bg-[hsl(var(--accent-yellow))] border-foreground",
            textColor: "text-foreground",
            icon: "🌿",
            description: "Building connections",
        },
        advanced: {
            label: "Advanced",
            color: "bg-[hsl(var(--primary))] border-foreground", // Pink
            textColor: "text-foreground",
            icon: "🌳",
            description: "Complex applications",
        },
    }

    const config = difficultyConfig[level]

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <motion.div
                key={level}
                initial={showChange ? { scale: 0.8, opacity: 0 } : false}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-foreground shadow-[2px_2px_0_0_rgba(0,0,0,1)]",
                    config.color,
                    showChange && "ring-2 ring-offset-2 ring-offset-background"
                )}
            >
                <span className="text-lg leading-none filter drop-shadow-sm">{config.icon}</span>
            </motion.div>

            <div className="flex flex-col">
                {showLabel && (
                    <div className="flex items-center gap-2">
                        <span className={cn("font-mono-display font-bold tracking-tight text-sm", config.textColor)}>
                            {config.label}
                        </span>
                        {showChange && previousLevel && previousLevel !== level && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-xs text-muted-foreground font-medium"
                            >
                                ← {difficultyConfig[previousLevel].label}
                            </motion.div>
                        )}
                    </div>
                )}
                {explanation && (
                    <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-xs text-muted-foreground mt-0.5 font-mono-display"
                    >
                        {explanation}
                    </motion.p>
                )}
            </div>
        </div>
    )
}
