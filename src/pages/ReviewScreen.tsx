import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, HelpCircle, Trophy, CheckCircle, Download, RotateCcw } from "lucide-react";
import PixelAvatar from "@/components/PixelAvatar";
import NeumorphicButton from "@/components/neumorphic/NeumorphicButton";
import ModeChip from "@/components/ui/ModeChip";
import XPCounter from "@/components/ui/XPCounter";
import { useApp } from "@/context/AppContext";
import { mockSession, mockAchievements } from "@/data/mockData";
import { cn } from "@/lib/utils";

const ReviewScreen = () => {
  const navigate = useNavigate();
  const { totalXP, concepts, resetSession } = useApp();

  const handleNewSession = () => {
    resetSession();
    navigate("/");
  };

  // Calculate session stats
  const totalQuestions = concepts.reduce((acc, c) => acc + c.questions.length, 0);
  const averageMastery = Math.round(
    concepts.reduce((acc, c) => acc + c.mastery, 0) / concepts.length
  );

  return (
    <div className="min-h-screen bg-background grid-bg">
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
          {/* Avatar section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-1/4 flex flex-col items-center lg:sticky lg:top-8"
          >
            <PixelAvatar
              state="celebrating"
              size="lg"
              showSpeechBubble
              message="Great session! You're becoming a master teacher! 🎉"
            />
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
            <div className="grid gap-4 sm:grid-cols-3">
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

            {/* Topic progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="neu-flat rounded-2xl p-6 space-y-4"
            >
              <h2 className="font-semibold text-foreground">Topic Progress</h2>
              
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
              <NeumorphicButton
                variant="outline"
                className="flex-1"
                onClick={() => {}}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Summary
              </NeumorphicButton>

              <NeumorphicButton
                variant="primary"
                className="flex-1"
                onClick={handleNewSession}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Start New Session
              </NeumorphicButton>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ReviewScreen;
