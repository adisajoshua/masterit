
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Lightbulb, RefreshCw, FileText, ChevronDown, CheckCircle } from "lucide-react"

export type RemediationType = 'hint' | 'simplify' | 'example';

interface RemediationPanelProps {
    isOpen: boolean
    onClose: () => void
    onSelectRemediation: (type: RemediationType) => void
    selectedRemediation?: RemediationType
    className?: string
}

export function RemediationPanel({
    isOpen,
    onClose,
    onSelectRemediation,
    selectedRemediation,
    className,
}: RemediationPanelProps) {

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={cn(
                            "fixed bottom-0 left-0 right-0 z-50 bg-background border-t-4 border-foreground shadow-[0_-8px_0_0_rgba(0,0,0,0.1)]",
                            className
                        )}
                    >
                        <div className="container max-w-2xl mx-auto p-6 pb-8">
                            <div className="flex items-center justify-between mb-8 border-b-2 border-dashed border-muted-foreground/20 pb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 flex items-center justify-center bg-[hsl(var(--accent-yellow))] border-2 border-foreground rounded-lg shadow-[4px_4px_0_0_black]">
                                        <Lightbulb className="w-6 h-6 text-foreground" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-display font-bold text-foreground transform -rotate-1">Need a Hand?</h3>
                                        <p className="font-medium text-muted-foreground font-mono-display text-sm">Choose your support strategy.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-muted border-2 border-transparent hover:border-foreground rounded-lg transition-all"
                                >
                                    <ChevronDown className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="grid gap-4">
                                <RemediationOption
                                    icon={Lightbulb}
                                    title="Get a Hint"
                                    description="A gentle nudge without giving away the answer."
                                    color="blue"
                                    onClick={() => onSelectRemediation('hint')}
                                    isSelected={selectedRemediation === 'hint'}
                                />
                                <RemediationOption
                                    icon={RefreshCw}
                                    title="Simplify Question"
                                    description="Try a more straightforward version first."
                                    color="green"
                                    onClick={() => onSelectRemediation('simplify')}
                                    isSelected={selectedRemediation === 'simplify'}
                                />
                                <RemediationOption
                                    icon={FileText}
                                    title="See an Example"
                                    description="View a model response to understand structure."
                                    color="purple"
                                    onClick={() => onSelectRemediation('example')}
                                    isSelected={selectedRemediation === 'example'}
                                />
                            </div>

                            <button
                                onClick={onClose}
                                className="mt-8 w-full py-4 text-base font-bold text-muted-foreground hover:text-foreground border-2 border-transparent hover:border-foreground hover:bg-surface rounded-xl transition-all font-mono-display uppercase tracking-wider"
                            >
                                I'll try on my own first
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

function RemediationOption({
    icon: Icon,
    title,
    description,
    color,
    onClick,
    isSelected
}: {
    icon: any,
    title: string,
    description: string,
    color: "blue" | "green" | "purple",
    onClick: () => void,
    isSelected: boolean
}) {
    const colorStyles = {
        blue: "bg-sky-blue text-foreground border-foreground",
        green: "bg-mint text-foreground border-foreground",
        purple: "bg-primary text-foreground border-foreground",
    }

    return (
        <div
            onClick={onClick}
            className={cn(
                "cursor-pointer flex items-center gap-4 p-4 rounded-xl border-2 transition-all active:scale-[0.98] group text-left",
                isSelected
                    ? "border-foreground bg-surface shadow-[4px_4px_0_0_black]"
                    : "bg-background border-border-subtle hover:border-foreground hover:shadow-[4px_4px_0_0_rgba(0,0,0,0.1)]"
            )}
        >
            <div className={cn(
                "p-3 rounded-lg border-2 border-foreground shadow-[2px_2px_0_0_black] transition-transform group-hover:-rotate-3",
                colorStyles[color]
            )}>
                <Icon className="w-5 h-5 stroke-[2.5px]" />
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-lg text-foreground flex items-center gap-2 font-display">
                    {title}
                </h4>
                <p className="text-sm font-medium text-muted-foreground leading-snug">{description}</p>
            </div>
        </div>
    )
}
