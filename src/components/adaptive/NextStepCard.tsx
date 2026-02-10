import { ArrowRight, RotateCcw, Target, Dumbbell } from "lucide-react";
import RetroButton from "@/components/retro-ui/RetroButton";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export type NextStepType = 'advance' | 'remediate' | 'practice';

interface NextStepCardProps {
    type: NextStepType;
    conceptTitle: string;
    reason: string;
    onAction: () => void;
    className?: string;
}

const config = {
    advance: {
        icon: ArrowRight,
        title: "Ready to Advance",
        buttonText: "Start Next Topic",
        color: "bg-green-100 text-green-700 border-green-200",
        buttonVariant: "primary" as const
    },
    remediate: {
        icon: RotateCcw,
        title: "Let'sReview",
        buttonText: "Review Basics",
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
        buttonVariant: "outline" as const
    },
    practice: {
        icon: Dumbbell,
        title: "Practice Mode",
        buttonText: "Practice Skills",
        color: "bg-blue-100 text-blue-700 border-blue-200",
        buttonVariant: "outline" as const
    }
};

export const NextStepCard = ({ type, conceptTitle, reason, onAction, className }: NextStepCardProps) => {
    const { icon: Icon, title, buttonText, color, buttonVariant } = config[type];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "neu-flat p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-6",
                className
            )}
        >
            <div className={cn("shrink-0 p-4 rounded-full border-2", color)}>
                <Icon className="w-8 h-8" />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
                <h3 className="text-xl font-display font-bold text-foreground">{title}</h3>
                <p className="text-muted-foreground text-sm font-medium">To: <span className="text-foreground font-bold">{conceptTitle}</span></p>
                <div className="flex items-center gap-2 justify-center sm:justify-start mt-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded">Why?</span>
                    <p className="text-xs text-muted-foreground italic">"{reason}"</p>
                </div>
            </div>

            <RetroButton
                variant={buttonVariant}
                onClick={onAction}
                className="shrink-0 w-full sm:w-auto"
            >
                {buttonText}
                <Icon className="w-4 h-4 ml-2" />
            </RetroButton>
        </motion.div>
    );
};
