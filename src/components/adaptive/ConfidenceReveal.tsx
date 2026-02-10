
import { motion, useMotionValue, animate } from "framer-motion"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { CheckCircle2, Trophy, Target, Award } from "lucide-react"

interface ConfidenceRevealProps {
    finalScore: number // 0-1
    breakdown: {
        coverage: number
        consistency: number
        depth: number
    }
    showBreakdown?: boolean
    className?: string
}

export function ConfidenceReveal({
    finalScore,
    breakdown,
    showBreakdown = true,
    className,
}: ConfidenceRevealProps) {
    const count = useMotionValue(0)
    const [displayedScore, setDisplayedScore] = useState(0)

    useEffect(() => {
        const controls = animate(count, finalScore * 100, {
            duration: 2.5,
            ease: [0.22, 1, 0.36, 1], // Custom easeOut
            onUpdate: (latest) => setDisplayedScore(Math.round(latest)),
        })

        return controls.stop
    }, [finalScore])

    const getConfidenceLabel = (score: number) => {
        if (score >= 80) return "Mastery Achieved!"
        if (score >= 60) return "Strong Understanding"
        if (score >= 40) return "Making Progress"
        return "Needs Review"
    }

    const getColorClass = (score: number) => {
        // Neo-Brutalist palette
        if (score >= 80) return "text-foreground bg-[hsl(var(--accent-teal))]"
        if (score >= 60) return "text-foreground bg-[hsl(var(--accent-yellow))]"
        return "text-white bg-[hsl(var(--accent-coral))]"
    }

    const getStrokeColor = (score: number) => {
        if (score >= 80) return "stroke-[hsl(var(--accent-teal))]"
        if (score >= 60) return "stroke-[hsl(var(--accent-yellow))]"
        return "stroke-[hsl(var(--accent-coral))]"
    }

    const scoreColor = getColorClass(displayedScore)
    const strokeClass = getStrokeColor(displayedScore)

    return (
        <div className={cn("w-full max-w-md mx-auto text-center space-y-8", className)}>
            <div className="space-y-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm font-bold text-muted-foreground uppercase tracking-widest font-mono-display"
                >
                    Confidence Score
                </motion.div>

                <div className="relative flex items-center justify-center py-8">
                    {/* Background Circle */}
                    <div className="relative w-48 h-48 rounded-full border-4 border-gray-200 bg-surface shadow-[4px_4px_0_0_black]">
                        <svg className="w-full h-full transform -rotate-90">
                            <motion.circle
                                cx="96"
                                cy="96"
                                r="88" // (48 * 4 / 2) - border? No, SVG coords. 192px / 2 = 96. r=88 is good.
                                className={cn("fill-none stroke-current cap-round", strokeClass)}
                                strokeWidth="12"
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: finalScore }}
                                transition={{ duration: 2.5, ease: "easeOut" }}
                            />
                        </svg>
                    </div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-6xl font-display font-bold tracking-tighter text-foreground drop-shadow-sm">
                            {displayedScore}%
                        </span>
                    </div>
                </div>

                <motion.h2
                    key={getConfidenceLabel(displayedScore)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-3xl font-display font-bold text-foreground transform -rotate-1"
                >
                    {getConfidenceLabel(displayedScore)}
                </motion.h2>
            </div>

            {showBreakdown && (
                <div className="grid grid-cols-3 gap-4">
                    <ScoreCard
                        label="Coverage"
                        value={breakdown.coverage}
                        icon={Target}
                        delay={0.5}
                        color="bg-[hsl(var(--accent-teal))]"
                    />
                    <ScoreCard
                        label="Consistency"
                        value={breakdown.consistency}
                        icon={CheckCircle2}
                        delay={0.7}
                        color="bg-[hsl(var(--accent-yellow))]"
                    />
                    <ScoreCard
                        label="Depth"
                        value={breakdown.depth}
                        icon={Award}
                        delay={0.9}
                        color="bg-[hsl(var(--primary))]"
                    />
                </div>
            )}
        </div>
    )
}

function ScoreCard({ label, value, icon: Icon, delay, color }: { label: string, value: number, icon: any, delay: number, color: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-surface rounded-xl p-3 shadow-[4px_4px_0_0_black] border-2 border-foreground flex flex-col items-center gap-3 hover:translate-y-1 hover:shadow-none transition-all"
        >
            <div className={cn("p-2 rounded-lg border-2 border-foreground shadow-[2px_2px_0_0_black]", color)}>
                <Icon className="w-5 h-5 text-foreground stroke-[2.5px]" />
            </div>
            <div className="text-2xl font-bold text-foreground font-display">
                {Math.round(value * 100)}%
            </div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-mono-display">
                {label}
            </div>
        </motion.div>
    )
}
