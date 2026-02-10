import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import PixelAvatar from "@/components/PixelAvatar";
import MessageBox from "@/components/ui/MessageBox";
import RetroButton from "@/components/retro-ui/RetroButton";
import RetroCard from "@/components/retro-ui/RetroCard";
import ModeChip from "@/components/ui/ModeChip";
import XPCounter from "@/components/ui/XPCounter";
import BackNavigation from "@/components/ui/BackNavigation";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { AdaptiveConcept } from "@/types/adaptive";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { SubConceptSelector } from "@/components/adaptive/SubConceptSelector";

const ConceptsScreen = () => {
  const navigate = useNavigate();
  const { concepts, selectedConcept, setSelectedConcept, totalXP, completedConcepts } = useApp();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [targetedSubConcept, setTargetedSubConcept] = useState<string | null>(null);

  const handleConceptSelect = (concept: AdaptiveConcept) => {
    if (completedConcepts.includes(concept.id)) return;
    setSelectedConcept(concept);
    setIsDialogOpen(true);
  };

  const handleStartSession = () => {
    setIsDialogOpen(false);
    navigate("/teaching");
  };

  const getConfidenceStars = (confidence: string) => {
    if (confidence === 'high') return 5;
    if (confidence === 'medium') return 3;
    return 1;
  };

  return (
    <div className="min-h-screen bg-background grid-bg">
      <BackNavigation backTo="/material" backLabel="Back to Material" />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <ModeChip mode="selection" />
          <XPCounter value={totalXP} />
        </motion.div>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-8 items-start mt-28">
          {/* Avatar section - vertical stacking on all screen sizes */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-1/4 flex flex-col items-center gap-4 lg:sticky lg:top-8"
          >
            <PixelAvatar state="thinking" size="setup" className="flex-shrink-0" />
            <MessageBox
              message={
                selectedConcept
                  ? `Great choice! Let's master "${selectedConcept.title}" together!`
                  : "Pick a concept to teach me! Which one do you want to practice?"
              }
              variant="dotted"
            />
          </motion.div>

          {/* Concepts grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:w-3/4 space-y-6"
          >
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground mb-2">
                Choose a Concept
              </h1>
              <p className="text-muted-foreground">
                I found these key topics in your material. Which one should we tackle first?
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {concepts.map((concept, index) => {
                const isCompleted = completedConcepts.includes(concept.id);
                // Map AdaptiveConcept fields to UI
                const starCount = getConfidenceStars(concept.parsing_confidence);
                const mastery = concept.mastery || 0;
                const snippet = concept.snippet || concept.source_text_snippet || "";

                return (
                  <motion.div
                    key={concept.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <RetroCard
                      selected={selectedConcept?.id === concept.id && !isCompleted}
                      onClick={() => handleConceptSelect(concept)}
                      className={cn(
                        "h-full",
                        isCompleted && "opacity-50 pointer-events-none cursor-not-allowed"
                      )}
                    >
                      {/* Confidence stars */}
                      <div className="flex gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-4 h-4 transition-colors",
                              i <= starCount
                                ? "fill-gold text-gold"
                                : "text-muted"
                            )}
                          />
                        ))}
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold text-foreground mb-2">
                        {concept.title}
                      </h3>

                      {/* Snippet */}
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {snippet}
                      </p>

                      {/* Mastery indicator */}
                      <div className="mt-4 pt-3 border-t border-border">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            Mastery
                          </span>
                          <span className={cn(
                            "font-mono",
                            isCompleted ? "text-foreground" : "text-coral"
                          )}>
                            {isCompleted ? "Completed" : `${mastery}%`}
                          </span>
                        </div>
                        <div className="mt-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-foreground"
                            initial={{ width: 0 }}
                            animate={{ width: isCompleted ? "100%" : `${mastery}%` }}
                            transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                          />
                        </div>
                      </div>

                    </RetroCard>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Drill-Down Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">

          {selectedConcept && (
            <SubConceptSelector
              concept={selectedConcept}
              onSelect={setTargetedSubConcept}
            />
          )}

          <div className="flex justify-end mt-6 gap-3">
            <RetroButton variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </RetroButton>
            <RetroButton variant="primary" onClick={handleStartSession}>
              Start Teaching
            </RetroButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConceptsScreen;
