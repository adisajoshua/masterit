import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, AlertCircle, Flame } from "lucide-react";
import PixelAvatar from "@/components/PixelAvatar";
import NeumorphicButton from "@/components/neumorphic/NeumorphicButton";
import Confetti from "@/components/ui/Confetti";
import BackNavigation from "@/components/ui/BackNavigation";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

const SummaryScreen = () => {
  const navigate = useNavigate();
  const {
    currentCycleSummary,
    selectedConcept,
    addXP,
    markConceptComplete,
    setSelectedConcept,
    setCurrentQuestionIndex,
  } = useApp();

  const [showConfetti, setShowConfetti] = useState(false);
  const [animatedMastery, setAnimatedMastery] = useState(0);

  useEffect(() => {
    if (!currentCycleSummary) {
      navigate("/concepts");
      return;
    }

    // Award XP
    addXP(currentCycleSummary.xpEarned);

    // Animate mastery
    const timer = setTimeout(() => {
      setAnimatedMastery(currentCycleSummary.masteryPercentage);
    }, 500);

    // Show confetti for high scores
    if (currentCycleSummary.masteryPercentage >= 80) {
      setTimeout(() => setShowConfetti(true), 1000);
    }

    return () => clearTimeout(timer);
  }, [currentCycleSummary, addXP, navigate]);

  if (!currentCycleSummary || !selectedConcept) {
    return null;
  }

  const handleDeeperDive = () => {
    setCurrentQuestionIndex(0);
    navigate("/teaching");
  };

  const handleNextTopic = () => {
    markConceptComplete(selectedConcept.id);
    setSelectedConcept(null);
    setCurrentQuestionIndex(0);
    navigate("/concepts");
  };

  const handleReviewAll = () => {
    markConceptComplete(selectedConcept.id);
    navigate("/review");
  };

  const getStarRating = (percentage: number) => {
    if (percentage >= 90) return 5;
    if (percentage >= 80) return 4;
    if (percentage >= 70) return 3;
    if (percentage >= 60) return 2;
    return 1;
  };

  const stars = getStarRating(currentCycleSummary.masteryPercentage);

  return (
    <div className="min-h-screen bg-background grid-bg flex flex-col">
      <BackNavigation backTo="/teaching" backLabel="Back to Teaching" />
      <div className="flex-1 flex items-center justify-center p-6">
        {showConfetti && <Confetti />}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        {/* Modal card */}
        <div className="neu-convex rounded-3xl p-8 space-y-6">
          {/* Avatar celebration */}
          <div className="flex justify-center">
            <PixelAvatar
              state="celebrating"
              size="lg"
              className="md:hidden"
            />
            <PixelAvatar
              state="celebrating"
              size="summary-web"
              className="hidden md:block"
            />
          </div>

          {/* Title */}
          <div className="text-center">
            <h1 className="text-2xl font-display font-bold text-foreground">
              {currentCycleSummary.masteryPercentage >= 80
                ? "Amazing Teaching!"
                : currentCycleSummary.masteryPercentage >= 60
                ? "Good Progress!"
                : "Keep Practicing!"}
            </h1>
            <p className="text-muted-foreground mt-1">{selectedConcept.title}</p>
          </div>

          {/* Stars */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
                className={cn(
                  "text-3xl",
                  i <= stars ? "text-gold" : "text-muted opacity-30"
                )}
              >
                ⭐
              </motion.span>
            ))}
          </div>

          {/* Mastery meter */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Mastery Level</span>
              <span className="font-mono font-bold text-coral">
                {animatedMastery}%
              </span>
            </div>
            <div className="h-4 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-foreground"
                initial={{ width: 0 }}
                animate={{ width: `${animatedMastery}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* XP earned */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2 py-3 neu-flat rounded-xl"
          >
            <Flame className="w-6 h-6 text-coral" />
            <span className="text-xl font-bold text-foreground">
              +{currentCycleSummary.xpEarned} XP
            </span>
          </motion.div>

          {/* Strengths & Gaps */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Strengths */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-turquoise flex items-center gap-1">
                <Check className="w-4 h-4" /> Strengths
              </h3>
              <ul className="space-y-1">
                {currentCycleSummary.strengths.map((strength, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <Check className="w-3 h-3 text-turquoise mt-1 flex-shrink-0" />
                    {strength}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Gaps */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-coral flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> To Review
              </h3>
              <ul className="space-y-1">
                {currentCycleSummary.gaps.map((gap, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <AlertCircle className="w-3 h-3 text-coral mt-1 flex-shrink-0" />
                    {gap}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3 pt-4">
            <NeumorphicButton
              onClick={handleDeeperDive}
              variant="outline"
              className="w-full"
            >
              Deeper Dive
            </NeumorphicButton>

            <NeumorphicButton
              onClick={handleNextTopic}
              variant="primary"
              className="w-full"
            >
              Next Topic
            </NeumorphicButton>

            <NeumorphicButton
              onClick={handleReviewAll}
              variant="outline"
              className="w-full"
            >
              Review All
            </NeumorphicButton>
          </div>
        </div>
      </motion.div>
      </div>
    </div>
  );
};

export default SummaryScreen;
