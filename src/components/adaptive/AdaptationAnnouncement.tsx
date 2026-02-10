
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { X, TrendingUp, Target, Lightbulb, AlertCircle, RefreshCw } from "lucide-react"
import { DifficultyLevel, DifficultyIndicator } from "./DifficultyIndicator"

export type AdaptationType =
    | 'difficulty_increase'
    | 'difficulty_decrease'
    | 'remediation_offered'
    | 'frustration_detected'
    | 'recovery_started'

interface AdaptationAnnouncementProps {
    type: AdaptationType
    from?: DifficultyLevel
    to?: DifficultyLevel
    reason: string
    duration?: number
    onDismiss?: () => void
    userAcknowledgment?: boolean
}

export function AdaptationAnnouncement({
    type,
    from,
    to,
    reason,
    duration = 5000,
    onDismiss,
    userAcknowledgment = false,
}: AdaptationAnnouncementProps) {

    const adaptationConfig = {
        difficulty_increase: {
            title: "Level Up!",
            Icon: TrendingUp,
            defaultReason: "Your understanding is growing!",
            // Pink for success/level up
            accent: "bg-[hsl(var(--primary))] text-white border-2 border-foreground",
            iconWrap: "bg-surface border-2 border-foreground",
        },
        difficulty_decrease: {
            title: "Adjusting Pace",
            Icon: Target,
            defaultReason: "Let's build a stronger foundation.",
            // Yellow for adjustment
            accent: "bg-[hsl(var(--accent-yellow))] text-foreground border-2 border-foreground",
            iconWrap: "bg-surface border-2 border-foreground",
        },
        remediation_offered: {
            title: "Need a Hint?",
            Icon: Lightbulb,
            defaultReason: "Here's a nudge in the right direction.",
            // Teal for help
            accent: "bg-[hsl(var(--accent-teal))] text-white border-2 border-foreground",
            iconWrap: "bg-surface border-2 border-foreground",
        },
        frustration_detected: {
            title: "Take a Breather",
            Icon: AlertCircle,
            defaultReason: "This is tough. Let's simplify.",
            // Coral/Orange for warning
            accent: "bg-[hsl(var(--accent-coral))] text-white border-2 border-foreground",
            iconWrap: "bg-surface border-2 border-foreground",
        },
        recovery_started: {
            title: "Fresh Start",
            Icon: RefreshCw,
            defaultReason: "Let's approach this differently.",
            // Teal for recovery
            accent: "bg-[hsl(var(--accent-teal))] text-white border-2 border-foreground",
            iconWrap: "bg-surface border-2 border-foreground",
        },
    }

    const config = adaptationConfig[type]
    const Icon = config.Icon

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={cn(
                "relative rounded-xl border-2 border-foreground bg-surface p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)]",
                "mx-auto max-w-md w-full"
            )}
        >
            <div className="flex items-start gap-4">
                {/* Icon with offset shadow style */}
                <div className={cn("p-2 rounded-lg shadow-[2px_2px_0_0_rgba(0,0,0,1)]", config.accent)}>
                    <Icon className="w-5 h-5 stroke-[3px]" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <h4 className="font-display font-bold text-lg leading-none mb-1">
                            {config.title}
                        </h4>
                        {!userAcknowledgment && onDismiss && (
                            <button
                                onClick={onDismiss}
                                className="text-foreground hover:bg-muted transition-colors p-1 rounded-md border border-transparent hover:border-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    <p className="font-medium text-foreground leading-snug">
                        {reason || config.defaultReason}
                    </p>

                    {from && to && (
                        <div className="mt-3 flex items-center gap-2 text-sm bg-muted/30 p-2 rounded-lg border border-border-subtle">
                            <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider font-mono-display">From:</span>
                            <DifficultyIndicator level={from} showLabel={false} className="scale-75 origin-left" />
                            <span className="text-muted-foreground">→</span>
                            <DifficultyIndicator level={to} showLabel={true} className="scale-90 origin-left" />
                        </div>
                    )}

                    {userAcknowledgment && (
                        <div className="mt-3 flex gap-2">
                            <button
                                className="rounded-lg bg-foreground text-surface px-3 py-1.5 text-xs font-bold shadow-[2px_2px_0_0_rgba(0,0,0,0.2)] hover:translate-y-px hover:shadow-none transition-all active:translate-y-0.5 border border-foreground"
                            >
                                Got it
                            </button>
                            <button
                                className="rounded-lg bg-surface text-foreground px-3 py-1.5 text-xs font-bold shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-y-px hover:shadow-none transition-all active:translate-y-0.5 border border-foreground"
                            >
                                Tell me more
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
