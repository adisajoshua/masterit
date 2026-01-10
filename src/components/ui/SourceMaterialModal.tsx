import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Concept } from "@/data/mockData";

interface SourceMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  concepts: Concept[];
  activeConceptId: string;
}

const SourceMaterialModal = ({
  isOpen,
  onClose,
  concepts,
  activeConceptId,
}: SourceMaterialModalProps) => {
  const activeRef = useRef<HTMLDivElement>(null);

  // Scroll to active concept when modal opens
  useEffect(() => {
    if (isOpen && activeRef.current) {
      setTimeout(() => {
        activeRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 300);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={cn(
          "max-w-2xl w-[95vw] max-h-[80vh] flex flex-col overflow-hidden",
          "bg-surface border border-foreground rounded-xl",
          "shadow-offset-dark p-0"
        )}
      >
        <DialogHeader className="flex-shrink-0 bg-surface border-b border-foreground/20 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-coral/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-coral" />
            </div>
            <DialogTitle className="text-xl font-display font-bold text-foreground">
              Source Material
            </DialogTitle>
          </div>
          <DialogClose className="absolute right-4 top-4 w-8 h-8 rounded-lg border border-foreground/20 flex items-center justify-center hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </DialogClose>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 pb-8 space-y-4">
          <AnimatePresence mode="wait">
            {concepts.map((concept, index) => {
              const isActive = concept.id === activeConceptId;

              return (
                <motion.div
                  key={concept.id}
                  ref={isActive ? activeRef : undefined}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "relative rounded-xl p-5 transition-all duration-300",
                    isActive
                      ? "bg-coral/15 border-2 border-coral shadow-offset-pink"
                      : "bg-muted/30 border border-foreground/10 opacity-50 blur-[0.5px]"
                  )}
                >
                  {/* Active indicator badge */}
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 px-3 py-1 bg-coral text-white text-xs font-semibold rounded-full shadow-md"
                    >
                      Currently Teaching
                    </motion.div>
                  )}

                  {/* Concept title */}
                  <h3
                    className={cn(
                      "font-display font-semibold mb-3 transition-all",
                      isActive
                        ? "text-lg text-foreground"
                        : "text-base text-muted-foreground"
                    )}
                  >
                    {concept.title}
                  </h3>

                  {/* Concept content */}
                  <p
                    className={cn(
                      "leading-relaxed transition-all",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground text-sm"
                    )}
                  >
                    {concept.snippet}
                  </p>

                  {/* Hover overlay for inactive concepts */}
                  {!isActive && (
                    <div className="absolute inset-0 rounded-xl bg-transparent hover:bg-background/30 transition-all cursor-pointer group">
                      <div className="opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center">
                        <span className="text-xs text-muted-foreground bg-background/80 px-3 py-1 rounded-full">
                          Preview only
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SourceMaterialModal;
