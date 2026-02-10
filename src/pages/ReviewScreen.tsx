import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, HelpCircle, Trophy, CheckCircle, Download, RotateCcw, ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";
import PixelAvatar from "@/components/PixelAvatar";
import MessageBox from "@/components/ui/MessageBox";
import RetroButton from "@/components/retro-ui/RetroButton";
import ModeChip from "@/components/ui/ModeChip";
import XPCounter from "@/components/ui/XPCounter";
import BackNavigation from "@/components/ui/BackNavigation";
import { useApp } from "@/context/AppContext";
import { mockSession, mockAchievements } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { NextStepCard, NextStepType } from "@/components/adaptive/NextStepCard";

const ReviewScreen = () => {
  const navigate = useNavigate();
  const { totalXP, concepts, resetSession } = useApp();
  const [isTopicAnalysisOpen, setIsTopicAnalysisOpen] = useState(true);
  const [isQuestionBreakdownOpen, setIsQuestionBreakdownOpen] = useState(true);

  const handleNewSession = () => {
    resetSession();
    navigate("/");
  };

  // Calculate session stats
  const totalQuestions = concepts.reduce((acc, c) => acc + c.questions.length, 0);
  const averageMastery = Math.round(
    concepts.reduce((acc, c) => acc + c.mastery, 0) / concepts.length
  );

  // Determine intelligent next step
  const getNextStep = (): { type: NextStepType; title: string; reason: string } => {
    const endDifficulty = mockSession.trajectory?.endDifficulty;
    const depth = mockSession.metrics?.depth || 0;

    if (endDifficulty === 'advanced' || (endDifficulty === 'intermediate' && depth > 70)) {
      return {
        type: 'advance',
        title: "Evolutionary Mechanisms II",
        reason: "You've mastered the core concepts.",
      };
    }

    if (endDifficulty === 'basic' || (mockSession.metrics?.coverage || 0) < 50) {
      return {
        type: 'remediate',
        title: "Foundations of Selection",
        reason: "Let's strengthen your basics first.",
      };
    }

    return {
      type: 'practice',
      title: "Mixed Practice Set",
      reason: "Great progress! Let's solidify this.",
    };
  };

  const nextStep = getNextStep();

  // Find strongest concept
  const strongestConcept = concepts.reduce((prev, current) =>
    (prev.mastery > current.mastery) ? prev : current
  );

  return (
    <div className="min-h-screen bg-background grid-bg">
      <BackNavigation backTo="/concepts" backLabel="Back to Concepts" />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <ModeChip mode="review" />
          <XPCounter value={totalXP} />
        </motion.div>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-8 mt-28">
          {/* Avatar section - horizontal on mobile/tablet, vertical on desktop */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-1/4 flex flex-row lg:flex-col items-center gap-4 lg:sticky lg:top-8"
          >
            <PixelAvatar state="celebrating" size="lg" className="flex-shrink-0" />
            <MessageBox message="Great session! You're becoming a master teacher! 🎉" variant="dotted" />
          </motion.div>

          {/* Stats section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-3/4 space-y-6"
          >
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground mb-2">
                Session Review
              </h1>
              <p className="text-muted-foreground">
                Here's how you did in this teaching session
              </p>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* ... existing stats ... */}
              {[
                {
                  icon: Clock,
                  label: "Time Spent",
                  value: mockSession.sessionStats.timeSpent,
                  color: "text-sky",
                },
                {
                  icon: HelpCircle,
                  label: "Questions",
                  value: totalQuestions.toString(),
                  color: "text-turquoise",
                },
                {
                  icon: Trophy,
                  label: "Overall Mastery",
                  value: `${averageMastery}%`,
                  color: "text-coral",
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="neu-flat rounded-2xl p-4 text-center"
                >
                  <stat.icon className={cn("w-8 h-8 mx-auto mb-2", stat.color)} />
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Learning Trajectory (New) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="neu-flat rounded-2xl p-6 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div>
                  <h2 className="text-xl font-display font-bold text-foreground">Learning Journey</h2>
                  <p className="text-sm text-muted-foreground">How the session adapted to you</p>
                </div>
                {/* Confidence Reveal Wrapper */}
                <div className="flex bg-background/50 rounded-full px-4 py-2 border border-border items-center gap-3">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Coverage</span>
                    <span className="font-mono text-xs text-foreground">{mockSession.metrics?.coverage || 0}%</span>
                  </div>
                  <div className="h-6 w-px bg-border"></div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Consistency</span>
                    <span className="font-mono text-xs text-foreground">{mockSession.metrics?.consistency || 0}%</span>
                  </div>
                  <div className="h-6 w-px bg-border"></div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Depth</span>
                    <span className="font-mono text-xs text-foreground">{mockSession.metrics?.depth || 0}%</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 space-y-2">
                {/* Labels */}
                <div className="flex justify-between px-2">
                  <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Started</span>
                  <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Ended</span>
                </div>

                {/* Path Visuals */}
                {/* Path Visuals - Scrollable on mobile */}
                <div className="overflow-x-auto pb-4 -mb-4">
                  <div className="flex items-center justify-between gap-4 min-w-[600px]">
                    {/* Start Pill */}
                    <div className={cn(
                      "px-4 py-2 rounded-full border-2 font-bold uppercase tracking-wider text-sm whitespace-nowrap",
                      mockSession.trajectory?.startDifficulty === 'basic' ? "bg-green-100 text-green-700 border-green-200" :
                        mockSession.trajectory?.startDifficulty === 'advanced' ? "bg-red-100 text-red-700 border-red-200" :
                          "bg-yellow-100 text-yellow-700 border-yellow-200"
                    )}>
                      {mockSession.trajectory?.startDifficulty}
                    </div>

                    {/* Path Line */}
                    <div className="flex-1 relative h-6 flex items-center justify-center">
                      <div className="absolute left-0 right-0 h-1 bg-border/50 rounded-full" />
                      {/* Dots for the path */}
                      <div className="flex justify-between w-full relative z-10 px-2">
                        {mockSession.trajectory?.path.map((level, i) => (
                          <div key={i} className={cn(
                            "w-3 h-3 rounded-full border-2 border-background shadow-sm",
                            level === 'basic' ? "bg-green-500" :
                              level === 'advanced' ? "bg-red-500" :
                                "bg-yellow-500"
                          )} />
                        ))}
                      </div>
                      {/* Connective arrow */}
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-background rounded-full p-0.5 border border-border/50">
                        <CheckCircle className="w-4 h-4 text-muted-foreground/30" />
                      </div>
                    </div>

                    {/* End Pill */}
                    <div className={cn(
                      "px-4 py-2 rounded-full border-2 font-bold uppercase tracking-wider text-sm shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] whitespace-nowrap",
                      mockSession.trajectory?.endDifficulty === 'basic' ? "bg-green-100 text-green-700 border-green-200" :
                        mockSession.trajectory?.endDifficulty === 'advanced' ? "bg-red-100 text-red-700 border-red-200" :
                          "bg-yellow-100 text-yellow-700 border-yellow-200"
                    )}>
                      {mockSession.trajectory?.endDifficulty}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Next Steps (Intelligent) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <h2 className="font-semibold text-foreground mb-4">Recommended Next Step</h2>
              <NextStepCard
                type={nextStep.type}
                conceptTitle={nextStep.title}
                reason={nextStep.reason}
                onAction={handleNewSession}
              />
            </motion.div>

            {/* Topic progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="neu-flat rounded-2xl p-6 space-y-4"
            >
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsTopicAnalysisOpen(!isTopicAnalysisOpen)}
              >
                <h2 className="font-semibold text-foreground">Topic Analysis</h2>
                {isTopicAnalysisOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
              </div>

              {isTopicAnalysisOpen && (
                <div className="space-y-4">

                  {/* Strengths Text */}
                  <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-start gap-3">
                    <Trophy className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-green-800">You really nailed <span className="underline decoration-wavy decoration-green-300">{strongestConcept.title}</span>!</p>
                      <p className="text-xs text-green-700 mt-1">Your explanations here were clear and accurate.</p>
                    </div>
                  </div>

                  {concepts.map((concept, index) => (
                    <motion.div
                      key={concept.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">{concept.title}</span>
                        <span className="text-sm font-mono text-coral">{concept.mastery}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className={cn(
                            "h-full",
                            concept.mastery >= 80
                              ? "bg-turquoise"
                              : concept.mastery >= 60
                                ? "bg-gold"
                                : "bg-coral"
                          )}
                          initial={{ width: 0 }}
                          animate={{ width: `${concept.mastery}%` }}
                          transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="neu-flat rounded-2xl p-6 space-y-4"
            >
              <h2 className="font-semibold text-foreground">Achievements Earned</h2>

              <div className="grid gap-3 sm:grid-cols-2">
                {mockAchievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gold/10 border border-gold/20"
                  >
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">
                        {achievement.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                    <span className="text-sm font-mono text-coral">
                      +{achievement.xp}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Question Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="neu-flat rounded-2xl p-6 space-y-4"
            >
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsQuestionBreakdownOpen(!isQuestionBreakdownOpen)}
              >
                <h2 className="font-semibold text-foreground">Question Breakdown</h2>
                {isQuestionBreakdownOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
              </div>
              {isQuestionBreakdownOpen && (
                <div className="space-y-4">
                  {mockSession.history?.map((item: any, index: number) => (
                    <div key={item.id} className="border-2 border-border-subtle rounded-xl p-4 space-y-2 bg-background/50">
                      <div className="flex justify-between items-start gap-4">

                        <div className="flex items-center gap-2">
                          {/* Difficulty Badge (Small) */}
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            item.score > 0.8 ? "bg-red-500" : item.score > 0.4 ? "bg-yellow-500" : "bg-green-500"
                          )} title="Estimated Difficulty" />
                          <p className="font-medium text-foreground">{item.question}</p>
                        </div>

                        <span className={cn(
                          "text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                          item.status === 'correct' ? "bg-green-100 text-green-700 border-green-200" :
                            item.status === 'partial' ? "bg-yellow-100 text-yellow-700 border-yellow-200" :
                              "bg-red-100 text-red-700 border-red-200"
                        )}>
                          {item.status}
                        </span>
                      </div>
                      <div className="pl-4 border-l-2 border-border-subtle space-y-1">
                        <p className="text-sm text-foreground/80"><span className="font-bold text-xs uppercase text-muted-foreground mr-2">You:</span> {item.userAnswer}</p>
                        <p className="text-sm text-muted-foreground"><span className="font-bold text-xs uppercase text-turquoise mr-2">AI:</span> {item.aiFeedback}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Gaps to review */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="neu-flat rounded-2xl p-6 space-y-4"
            >
              <h2 className="font-semibold text-foreground">Areas to Review</h2>
              <ul className="space-y-2">
                {mockSession.sessionStats.gapsToReview.map((gap, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.05 }}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle className="w-4 h-4 text-coral" />
                    {gap}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <RetroButton
                variant="outline"
                className="flex-1"
                onClick={() => { }}
              >
                <Download className="w-4 h-4" />
                Download Summary
              </RetroButton>

              <RetroButton
                variant="primary"
                className="flex-1"
                onClick={handleNewSession}
              >
                <RotateCcw className="w-4 h-4" />
                Start New Session
              </RetroButton>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ReviewScreen;
