import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import PixelAvatar from "@/components/PixelAvatar";
import MessageBox from "@/components/ui/MessageBox";
import LoadingDots from "@/components/ui/LoadingDots";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import { RealAdaptiveService, USE_REAL_AI } from "@/services/ai/RealAdaptiveService";
import { AdaptiveConcept } from "@/types/adaptive";

// ... existing imports

// ... inside component

setConcepts(result.concepts as AdaptiveConcept[]);
          }

// Done
setTimeout(() => navigate("/concepts"), 500);

        } else {
  // Fallback / Mock Mode
  // Perform distinct steps for "Look and Feel"
  setCurrentStep(1);
  await new Promise(r => setTimeout(r, 2000));
  setCompletedSteps(prev => [...prev, "concepts"]);

  setCurrentStep(2);
  await new Promise(r => setTimeout(r, 1500));
  setCompletedSteps(prev => [...prev, "plan"]);

  setTimeout(() => navigate("/concepts"), 800);
}

      } catch (err) {
  console.error("Processing failed", err);
  setError("I had trouble reading that. Please try again.");
}
    };

processMaterial();

return () => { isMounted = false; };
  }, [navigate, studyMaterial, setConcepts]);

if (error) {
  return (
    <div className="min-h-screen bg-background grid-bg flex items-center justify-center p-6">
      <div className="text-center">
        <PixelAvatar state="confused" size="setup" />
        <p className="text-destructive font-bold mt-4">{error}</p>
        <button onClick={() => navigate('/material')} className="mt-4 underline">Try Again</button>
      </div>
    </div>
  );
}

return (
  <div className="min-h-screen bg-background grid-bg flex items-center justify-center p-6">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-8 max-w-md w-full"
    >
      {/* Avatar thinking - centered modal style */}
      <div className="flex items-center gap-4">
        <PixelAvatar state="thinking" size="setup" />
        <MessageBox message="Let me analyze this material... 🧠" variant="dotted" />
      </div>

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
            className="h-full bg-foreground"
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
