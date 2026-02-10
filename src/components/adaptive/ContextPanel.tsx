
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, BarChart2, ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdaptiveConcept } from "@/types/adaptive";
import { DifficultyIndicator } from "./DifficultyIndicator";

interface ContextPanelProps {
    concept: AdaptiveConcept;
    currentDifficulty: "basic" | "intermediate" | "advanced";
    progress: number;
    className?: string;
    isMobile?: boolean;      // New prop
    onClose?: () => void;    // New prop
}

export function ContextPanel({ concept, currentDifficulty, progress, className, isMobile, onClose }: ContextPanelProps) {
    const [activeTab, setActiveTab] = useState<"source" | "stats">("source");
    const [isCollapsed, setIsCollapsed] = useState(false);

    // If mobile, force expanded (drawer handles visibility)
    const effectiveCollapsed = isMobile ? false : isCollapsed;

    return (
        <div className={cn(
            "flex flex-col bg-surface relative transition-all duration-300",
            // Desktop styling
            !isMobile && "border-l-2 border-foreground",
            // Mobile styling (full width of container/drawer)
            isMobile && "w-full h-full",
            // Desktop styling logic
            !isMobile && (effectiveCollapsed ? "w-[64px]" : "w-[350px] xl:w-[400px]"),
            className
        )}>
            {/* Collapse Toggle (Desktop Only) */}
            {!isMobile && (
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -left-3 top-6 bg-surface border-2 border-foreground rounded-full p-1 shadow-[2px_2px_0_0_black] hover:scale-110 transition-transform z-10"
                >
                    {isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
            )}

            {isCollapsed ? (
                <div className="flex flex-col items-center gap-4 py-8">
                    <button
                        onClick={() => { setIsCollapsed(false); setActiveTab("source"); }}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        <BookOpen className="w-5 h-5 text-muted-foreground" />
                    </button>
                    <button
                        onClick={() => { setIsCollapsed(false); setActiveTab("stats"); }}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        <BarChart2 className="w-5 h-5 text-muted-foreground" />
                    </button>

                    {/* Vertical Text */}
                    <div className="mt-8 rotate-180 text-muted-foreground font-mono-display text-xs tracking-widest uppercase" style={{ writingMode: 'vertical-rl' }}>
                        Context Panel
                    </div>
                </div>
            ) : (
                <>
                    {/* Mobile Header */}
                    {isMobile && onClose && (
                        <div className="flex items-center justify-between p-4 border-b-2 border-foreground bg-surface sticky top-0 z-20">
                            <h3 className="font-bold font-display text-lg">Context & Stats</h3>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-muted rounded-full transition-all active:scale-95"
                            >
                                <span className="sr-only">Close</span>
                                ✕
                            </button>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex border-b-2 border-foreground">
                        <button
                            onClick={() => setActiveTab("source")}
                            className={cn(
                                "flex-1 py-3 px-4 font-bold font-display text-sm flex items-center justify-center gap-2 transition-colors",
                                activeTab === "source"
                                    ? "bg-surface text-foreground"
                                    : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                            )}
                        >
                            <BookOpen className="w-4 h-4" />
                            Source Text
                        </button>
                        <button
                            onClick={() => setActiveTab("stats")}
                            className={cn(
                                "flex-1 py-3 px-4 font-bold font-display text-sm flex items-center justify-center gap-2 transition-colors",
                                activeTab === "stats"
                                    ? "bg-surface text-foreground"
                                    : "bg-muted/30 text-muted-foreground hover:bg-muted/50 border-l-2 border-foreground"
                            )}
                        >
                            <BarChart2 className="w-4 h-4" />
                            Dashboard
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                        <AnimatePresence mode="wait">
                            {activeTab === "source" ? (
                                <motion.div
                                    key="source"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="space-y-4"
                                >
                                    <div className="bg-yellow-100/50 p-4 border-l-4 border-[hsl(var(--accent-yellow))] rounded-r-lg">
                                        <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-1">
                                            Topic
                                        </h4>
                                        <p className="font-display font-bold text-lg leading-tight">
                                            {concept.title}
                                        </p>
                                    </div>

                                    <div className="prose prose-sm max-w-none prose-headings:font-display prose-p:font-serif">
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mt-6 mb-3">
                                            Reference Material
                                        </h4>
                                        <div className="bg-white p-4 rounded-lg border border-border-subtle shadow-sm text-base leading-relaxed text-foreground/90 font-serif whitespace-pre-wrap">
                                            {concept.source_text_snippet || "No source text available."}
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
                                            Core Concepts
                                        </h4>
                                        <ul className="space-y-2">
                                            {concept.core_statements.map((stmt, idx) => (
                                                <li key={idx} className="bg-blue-50/50 p-3 rounded border border-blue-100 text-sm leading-snug flex gap-2">
                                                    <span className="text-blue-500 font-bold">•</span>
                                                    {stmt}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="stats"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                                            Session Status
                                        </h4>
                                        <div className="grid grid-cols-1 gap-3">
                                            <div className="bg-surface p-4 rounded-xl border-2 border-foreground shadow-[4px_4px_0_0_black]">
                                                <div className="text-xs font-bold text-muted-foreground uppercase mb-1">Current Difficulty</div>
                                                <DifficultyIndicator level={currentDifficulty} showLabel />
                                            </div>

                                            <div className="bg-surface p-4 rounded-xl border-2 border-foreground shadow-[4px_4px_0_0_black]">
                                                <div className="text-xs font-bold text-muted-foreground uppercase mb-2">Completion</div>
                                                <div className="h-4 bg-muted rounded-full overflow-hidden border border-foreground">
                                                    <motion.div
                                                        className="h-full bg-[hsl(var(--primary))]"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                                <div className="text-right text-xs font-bold mt-1">{Math.round(progress)}%</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                                            Concepts Covered
                                        </h4>
                                        {/* Dynamic Concepts Checklist */}
                                        <div className="space-y-2">
                                            {concept.sub_concepts ? (
                                                concept.sub_concepts.map((sub, idx) => (
                                                    <div key={idx} className={cn(
                                                        "flex items-center gap-3 p-3 rounded-lg border transition-all",
                                                        sub.completed
                                                            ? "bg-green-50/80 border-green-200"
                                                            : "bg-surface border-border-subtle hover:border-foreground/30"
                                                    )}>
                                                        <div className={cn(
                                                            "w-5 h-5 rounded-full flex items-center justify-center border-2 transition-colors",
                                                            sub.completed
                                                                ? "bg-green-500 border-green-600 text-white"
                                                                : "border-muted-foreground/30"
                                                        )}>
                                                            {/* Simple checkmark icon replacement */}
                                                            {sub.completed && (
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                            )}
                                                        </div>
                                                        <span className={cn(
                                                            "text-sm font-medium",
                                                            sub.completed ? "text-green-900" : "text-foreground"
                                                        )}>
                                                            {sub.title}
                                                        </span>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-xs text-muted-foreground italic">No sub-concepts tracked.</p>
                                            )}
                                        </div>
                                    </div>



                                    <div>
                                        <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                                            Focus Areas
                                        </h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm p-2 bg-green-50 rounded border border-green-100">
                                                <span>Targeting Core Statements</span>
                                                <span className="font-bold text-green-700">High</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm p-2 bg-yellow-50 rounded border border-yellow-100">
                                                <span>Causal Reasoning</span>
                                                <span className="font-bold text-yellow-700">Med</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </>
            )}
        </div>
    );
}
