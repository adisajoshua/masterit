
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdaptiveConcept } from "@/types/adaptive";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface ConceptLike {
    id: string;
    title: string;
    sub_concepts?: { id: string; title: string; completed: boolean; difficulty?: string }[];
}

interface SubConceptSelectorProps {
    concept: ConceptLike;
    onSelect: (subConceptId: string | null) => void;
    className?: string;
}

export function SubConceptSelector({ concept, onSelect, className }: SubConceptSelectorProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleSelect = (id: string | null) => {
        setSelectedId(id);
        onSelect(id);
    };

    return (
        <div className={cn("space-y-4", className)}>
            <div className="space-y-2">
                <h3 className="font-display font-bold text-lg text-foreground">
                    Target a Specific Area
                </h3>
                <p className="text-sm text-muted-foreground">
                    Choose a sub-topic to focus on, or teach the whole concept.
                </p>
            </div>

            <div className="grid gap-3">
                {/* Option: Whole Concept */}
                <button
                    onClick={() => handleSelect(null)}
                    className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left group",
                        selectedId === null
                            ? "bg-surface border-foreground shadow-[4px_4px_0_0_black]"
                            : "bg-background border-border-subtle hover:border-foreground hover:shadow-[2px_2px_0_0_rgba(0,0,0,0.1)]"
                    )}
                >
                    <div className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                        selectedId === null ? "border-foreground bg-[hsl(var(--accent-yellow))]" : "border-muted-foreground"
                    )}>
                        {selectedId === null && <div className="w-2.5 h-2.5 rounded-full bg-foreground" />}
                    </div>
                    <div className="flex-1">
                        <span className="font-bold font-display text-base block mb-0.5">Full Concept ({concept.title})</span>
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Comprehensive Review</span>
                    </div>
                </button>

                {/* Sub-Concepts */}
                {concept.sub_concepts?.map((sub) => (
                    <button
                        key={sub.id}
                        onClick={() => handleSelect(sub.id)}
                        className={cn(
                            "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left group",
                            selectedId === sub.id
                                ? "bg-surface border-foreground shadow-[4px_4px_0_0_black]"
                                : "bg-background border-border-subtle hover:border-foreground hover:shadow-[2px_2px_0_0_rgba(0,0,0,0.1)]"
                        )}
                    >
                        <div className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0",
                            selectedId === sub.id ? "border-foreground bg-[hsl(var(--accent-teal))]" : "border-muted-foreground"
                        )}>
                            {selectedId === sub.id && <Check className="w-4 h-4 text-foreground" />}
                        </div>
                        <div className="flex-1 w-full">
                            <div className="flex items-center justify-between mb-0.5">
                                <div className="flex items-center gap-2 max-w-[80%]">
                                    <span className="font-bold font-display text-base truncate">{sub.title}</span>
                                    {sub.difficulty === 'basic' && !sub.completed && (
                                        <span className="shrink-0 text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-blue-200 shadow-sm animate-pulse">
                                            Recommended Start
                                        </span>
                                    )}
                                </div>
                                {sub.completed && (
                                    <span className="shrink-0 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-green-200">
                                        Done
                                    </span>
                                )}
                            </div>

                            {/* Difficulty Indicator with Tooltip */}
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex items-center gap-1.5 cursor-help">
                                            <div className={cn(
                                                "w-2 h-2 rounded-full",
                                                sub.difficulty === 'basic' ? "bg-green-500" :
                                                    sub.difficulty === 'advanced' ? "bg-red-500" :
                                                        "bg-yellow-500"
                                            )} />
                                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                                {sub.difficulty || 'intermediate'}
                                            </span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="bg-surface border-2 border-foreground shadow-[4px_4px_0_0_black] p-3 max-w-[200px]">
                                        <p className="font-bold text-xs mb-1 uppercase tracking-wider">
                                            {sub.difficulty === 'basic' ? "Basic Level" :
                                                sub.difficulty === 'advanced' ? "Advanced Level" : "Intermediate Level"}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {sub.difficulty === 'basic' ? "Good for starting out. Focuses on core definitions." :
                                                sub.difficulty === 'advanced' ? "Complex synthesis required. For deeper understanding." :
                                                    "Balanced challenge. The standard curriculum level."}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
