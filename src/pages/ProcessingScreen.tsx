import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import PixelAvatar from "@/components/PixelAvatar";
import LoadingDots from "@/components/ui/LoadingDots";
import { cn } from "@/lib/utils";

interface ProcessingStep {
  id: string;
  label: string;
  duration: number;
}

const steps: ProcessingStep[] = [
  { id: "reading", label: "Reading your text", duration: 1500 },
  { id: "concepts", label: "Finding key concepts", duration: 2000 },
  { id: "plan", label: "Building your lesson plan", duration: 1500 },
];

const ProcessingScreen = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  useEffect(() => {
    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCompletedSteps((prev) => [...prev, steps[currentStep].id]);
        setCurrentStep((prev) => prev + 1);
      }, steps[currentStep].duration);

      return () => clearTimeout(timer);
    } else {
      // All steps complete, navigate after a short delay
      const timer = setTimeout(() => {
        navigate("/concepts");
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [currentStep, navigate]);

  return (
    <div className="min-h-screen bg-background grid-bg flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-8 max-w-md w-full"
      >
        {/* Avatar thinking */}
        <PixelAvatar
          state="thinking"
          size="xl"
          showSpeechBubble
          message="Let me analyze this material... 🧠"
        />

        {/* Processing steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full space-y-4"
        >
          {steps.map((step, index) => {
            const isComplete = completedSteps.includes(step.id);
            const isActive = currentStep === index && !isComplete;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.2 }}
                className={cn(
                  "neu-flat rounded-xl p-4 flex items-center gap-4 transition-all duration-300",
                  isComplete && "ring-2 ring-turquoise/50",
                  isActive && "ring-2 ring-coral/50"
                )}
              >
                {/* Status indicator */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                    isComplete && "bg-turquoise text-white",
                    isActive && "bg-coral/20",
                    !isComplete && !isActive && "bg-muted"
                  )}
                >
                  {isComplete ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      <Check className="w-5 h-5" />
                    </motion.div>
                  ) : isActive ? (
                    <LoadingDots />
                  ) : (
                    <span className="text-muted-foreground text-sm font-mono">
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    "font-medium transition-colors duration-300",
                    isComplete && "text-turquoise",
                    isActive && "text-coral",
                    !isComplete && !isActive && "text-muted-foreground"
                  )}
                >
                  {step.label}
                  {isActive && <LoadingDots className="inline-block ml-1" />}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Progress indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full"
        >
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-coral to-turquoise"
              initial={{ width: "0%" }}
              animate={{
                width: `${((completedSteps.length) / steps.length) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProcessingScreen;
