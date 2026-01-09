import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mic, Keyboard } from "lucide-react";
import PixelAvatar from "@/components/PixelAvatar";
import NeumorphicButton from "@/components/neumorphic/NeumorphicButton";
import NeumorphicTextArea from "@/components/neumorphic/NeumorphicTextArea";
import ModeChip from "@/components/ui/ModeChip";
import XPCounter from "@/components/ui/XPCounter";
import ProgressBar from "@/components/ui/ProgressBar";
import Waveform from "@/components/ui/Waveform";
import BackNavigation from "@/components/ui/BackNavigation";
import { useApp } from "@/context/AppContext";
import { mockCycleSummaries } from "@/data/mockData";
import { cn } from "@/lib/utils";
import type { AvatarState } from "@/components/PixelAvatar";

const TeachingScreen = () => {
  const navigate = useNavigate();
  const {
    selectedConcept,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    totalXP,
    addXP,
    setCurrentCycleSummary,
  } = useApp();

  const [answer, setAnswer] = useState("");
  const [showContext, setShowContext] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [inputMode, setInputMode] = useState<"voice" | "text">("voice");
  const [avatarState, setAvatarState] = useState<AvatarState>("speaking");
  const [isEvaluating, setIsEvaluating] = useState(false);

  const questions = selectedConcept?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  useEffect(() => {
    if (!selectedConcept) {
      navigate("/concepts");
    }
  }, [selectedConcept, navigate]);

  useEffect(() => {
    // Avatar speaks the question
    setAvatarState("speaking");
    const timer = setTimeout(() => {
      setAvatarState("listening");
    }, 2000);
    return () => clearTimeout(timer);
  }, [currentQuestionIndex]);

  const handleVoiceHold = () => {
    setIsRecording(true);
    setAvatarState("listening");
  };

  const handleVoiceRelease = () => {
    setIsRecording(false);
    // Simulate transcription with expected answer
    if (currentQuestion) {
      setAnswer(currentQuestion.expectedAnswer);
    }
  };

  const handleSubmit = () => {
    if (!answer.trim()) return;

    setIsEvaluating(true);
    setAvatarState("thinking");

    // Simulate evaluation
    setTimeout(() => {
      // Award XP
      addXP(25);
      setAvatarState("celebrating");

      setTimeout(() => {
        if (currentQuestionIndex < totalQuestions - 1) {
          // Next question
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setAnswer("");
          setIsEvaluating(false);
        } else {
          // Cycle complete - show summary
          const summary = mockCycleSummaries[selectedConcept?.id || "natural-selection"];
          setCurrentCycleSummary(summary);
          navigate("/summary");
        }
      }, 1000);
    }, 1500);
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnswer("");
    setAvatarState("speaking");
  };

  if (!selectedConcept || !currentQuestion) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background grid-bg">
      <BackNavigation
        backTo="/concepts"
        backLabel="Back to Concepts"
        rightAction={{ label: "Restart", onClick: handleRestart }}
      />
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-6"
        >
          <div className="flex items-center gap-4">
            <ModeChip mode="teaching" />
            <span className="text-sm text-muted-foreground">
              {selectedConcept.title}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ProgressBar
              current={currentQuestionIndex + 1}
              total={totalQuestions}
              className="w-32"
            />
            <XPCounter value={totalXP} />
          </div>
        </motion.div>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-8 mt-28">
          {/* Avatar section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-1/3 flex flex-col items-center"
          >
            <PixelAvatar
              state={avatarState}
              size="lg"
              showSpeechBubble
              message={currentQuestion.text}
            />

            {/* Context toggle */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowContext(!showContext)}
              className="mt-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {showContext ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              {showContext ? "Hide" : "Show"} source material
            </motion.button>

            {/* Context panel */}
            <AnimatePresence>
              {showContext && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 w-full"
                >
                  <div className="neu-inset rounded-xl p-4 max-h-48 overflow-y-auto">
                    <p className="text-sm text-muted-foreground">
                      {selectedConcept.snippet}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Answer section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-2/3 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-semibold text-foreground">
                Your Explanation
              </h2>
              <div className="flex gap-2">
                <NeumorphicButton
                  size="sm"
                  variant="outline"
                  onClick={() => setInputMode("voice")}
                  className={cn(
                    "w-10 h-10 p-0 flex items-center justify-center",
                    inputMode === "voice" && "border-primary bg-primary/10"
                  )}
                >
                  <Mic className="w-4 h-4" />
                </NeumorphicButton>
                <NeumorphicButton
                  size="sm"
                  variant="outline"
                  onClick={() => setInputMode("text")}
                  className={cn(
                    "w-10 h-10 p-0 flex items-center justify-center",
                    inputMode === "text" && "border-primary bg-primary/10"
                  )}
                >
                  <Keyboard className="w-4 h-4" />
                </NeumorphicButton>
              </div>
            </div>

            {/* Sticky note style answer area */}
            <div
              className={cn(
                "relative rounded-2xl p-6 min-h-[200px] transition-all duration-300",
                "bg-gold/10 border-2 border-dashed border-gold/30",
                "shadow-[4px_4px_0_0_hsl(var(--gold)/0.2)]"
              )}
              style={{ fontFamily: "var(--font-handwritten)" }}
            >
              {inputMode === "voice" ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[150px] gap-4">
                  {isRecording ? (
                    <>
                      <Waveform active />
                      <p className="text-coral font-medium">Listening...</p>
                    </>
                  ) : answer ? (
                    <p className="text-lg text-foreground leading-relaxed">
                      {answer}
                    </p>
                  ) : (
                    <p className="text-muted-foreground text-center">
                      Hold the microphone button to record your explanation
                    </p>
                  )}
                </div>
              ) : (
                <NeumorphicTextArea
                  placeholder="Type your explanation here..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={6}
                  className="bg-transparent border-none shadow-none text-lg"
                  style={{ fontFamily: "var(--font-handwritten)" }}
                />
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {inputMode === "voice" && (
                <NeumorphicButton
                  onMouseDown={handleVoiceHold}
                  onMouseUp={handleVoiceRelease}
                  onMouseLeave={() => isRecording && handleVoiceRelease()}
                  onTouchStart={handleVoiceHold}
                  onTouchEnd={handleVoiceRelease}
                  variant="outline"
                  className="flex-1 relative"
                  disabled={isEvaluating}
                >
                  <Mic className="w-5 h-5 absolute left-4" />
                  <span className="w-full text-center">
                    {isRecording ? "Recording..." : "Hold to Speak"}
                  </span>
                </NeumorphicButton>
              )}

              <NeumorphicButton
                onClick={handleSubmit}
                disabled={!answer.trim() || isEvaluating}
                variant="primary"
                className="flex-1 flex items-center justify-center"
              >
                {isEvaluating ? "Evaluating..." : "Submit Answer"}
              </NeumorphicButton>
            </div>

            {/* Progress hint */}
            <p className="text-center text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TeachingScreen;
