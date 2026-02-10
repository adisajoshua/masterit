
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Keyboard, Eye, Lightbulb, BookOpen } from "lucide-react";
import PixelAvatar from "@/components/PixelAvatar";
import MessageBox from "@/components/ui/MessageBox";
import RetroButton from "@/components/retro-ui/RetroButton";
import RetroTextArea from "@/components/retro-ui/RetroTextArea";
import ModeChip from "@/components/ui/ModeChip";
import ProgressBar from "@/components/ui/ProgressBar";
import Waveform from "@/components/ui/Waveform";
import BackNavigation from "@/components/ui/BackNavigation";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import type { AvatarState } from "@/components/PixelAvatar";
import { DifficultyIndicator } from "@/components/adaptive/DifficultyIndicator";
import { AdaptationAnnouncement } from "@/components/adaptive/AdaptationAnnouncement";
import { RemediationPanel, RemediationType } from "@/components/adaptive/RemediationPanel";
import { ConfidenceReveal } from "@/components/adaptive/ConfidenceReveal";
import { ContextPanel } from "@/components/adaptive/ContextPanel"; // Import the new panel
import { useAdaptiveSession } from "@/hooks/useAdaptiveSession";

const TeachingScreen = () => {
  const navigate = useNavigate();
  const { addXP } = useApp();

  const {
    currentQuestion,
    currentDifficulty,
    questionType,
    submitAnswer,
    adaptationMessage,
    clearAdaptationMessage,
    concept, // Added concept object
    conceptTitle,
    progress,
    remediationData,
    triggerAdaptation // New trigger
  } = useAdaptiveSession();

  const [answer, setAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [inputMode, setInputMode] = useState<"voice" | "text">("voice");
  const [avatarState, setAvatarState] = useState<AvatarState>("speaking");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showRemediation, setShowRemediation] = useState(false);
  const [showMobileContext, setShowMobileContext] = useState(false); // New state for mobile context
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [displayedQuestionText, setDisplayedQuestionText] = useState("");
  const [activeHint, setActiveHint] = useState<string | null>(null);

  useEffect(() => {
    if (currentQuestion) {
      setDisplayedQuestionText(currentQuestion.text);
      setActiveHint(null);
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (adaptationMessage) {
      const timer = setTimeout(() => {
        clearAdaptationMessage();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [adaptationMessage, clearAdaptationMessage]);

  const handleVoiceHold = () => {
    setIsRecording(true);
    setAvatarState("listening");
  };

  const handleVoiceRelease = () => {
    setIsRecording(false);
    if (answer.length === 0) {
      setAnswer("This is a simulated voice response for testing purposes.");
    }
    setAvatarState("speaking");
  };

  const handleSubmit = async () => {
    if (!answer.trim()) return;

    setIsEvaluating(true);
    setAvatarState("thinking");

    const result = await submitAnswer(answer);

    addXP(50);
    setAnswer("");
    setIsEvaluating(false);
    setAvatarState("speaking");

    if (result && result.isComplete) {
      setIsSessionComplete(true);
    }
  };

  const handleRemediationSelect = (type: RemediationType) => {
    setShowRemediation(false);
    if (!remediationData) {
      alert("No specific help available for this diagnostic question.");
      return;
    }

    if (type === 'hint') {
      setActiveHint(remediationData.hint);
      setAvatarState("speaking");
    } else if (type === 'simplify') {
      if (remediationData.simplified_text) {
        setDisplayedQuestionText(remediationData.simplified_text);
        setActiveHint("I've simplified the question for you.");
      }
    } else if (type === 'example') {
      if (remediationData.example_answer) {
        setActiveHint(`For example: "${remediationData.example_answer}"`);
      }
    }
  };

  if (isSessionComplete) {
    navigate('/review');
    return null;
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Top Navigation */}
      <div className="shrink-0 z-50">
        <BackNavigation
          backTo="/concepts"
          backLabel="Back"
          rightContent={
            <div className="flex items-center gap-3">
              {/* Debug Trigger */}
              {/* 
              <button
                onClick={() => triggerAdaptation('frustration_detected', 'Manual trigger for testing purposes.')}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-md border border-red-200 text-xs font-bold uppercase tracking-wider hover:bg-red-200"
                title="Simulate Frustration Mode"
              >
                😤 Sim Frustration
              </button>
              */}

              <button
                onClick={() => setShowMobileContext(true)}
                className="lg:hidden p-2 hover:bg-muted rounded-full transition-colors flex items-center justify-center text-foreground"
                aria-label="Open Context"
              >
                <BookOpen className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowRemediation(true)}
                className="text-sm font-bold text-coral hover:underline uppercase tracking-wider font-mono-display"
              >
                Help
              </button>
            </div>
          }
        />
      </div>

      {/* Adaptation Notification Layer */}
      <AnimatePresence>
        {adaptationMessage && (
          <div className="fixed top-24 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
            <div className="pointer-events-auto max-w-md w-full">
              <AdaptationAnnouncement
                type={adaptationMessage.type as any}
                reason={adaptationMessage.reason}
                from={adaptationMessage.from}
                to={adaptationMessage.to}
                onDismiss={clearAdaptationMessage}
              />
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Active Hint Banner */}
      <AnimatePresence>
        {activeHint && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-24 left-0 right-0 z-30 flex justify-center px-4 pointer-events-none mt-16"
          >
            <div className="pointer-events-auto max-w-xl w-full bg-[hsl(var(--accent-teal))] text-white p-4 rounded-xl shadow-[4px_4px_0_0_black] border-2 border-foreground flex items-start gap-3">
              <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium font-mono-display leading-snug">{activeHint}</p>
              <button onClick={() => setActiveHint(null)} className="ml-auto hover:bg-black/10 p-1 rounded">
                <span className="sr-only">Dismiss</span>
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Context Overlay */}
      <AnimatePresence>
        {showMobileContext && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[60] bg-background lg:hidden flex flex-col"
          >
            {concept && (
              <ContextPanel
                concept={concept}
                currentDifficulty={currentDifficulty}
                progress={progress}
                isMobile={true}
                onClose={() => setShowMobileContext(false)}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Workspace: Split View */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Left: Teaching Area (Scrollable) */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="container mx-auto px-4 py-6 max-w-4xl pb-32">
            {/* Header Info */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center justify-between gap-4 mb-8"
            >
              <div className="flex items-center gap-4">
                <ModeChip mode="teaching" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Current Topic
                  </span>
                  <span className="text-sm font-bold text-foreground truncate max-w-[200px] sm:max-w-md">
                    {conceptTitle}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6 ml-auto lg:hidden">
                {/* Mobile-only progress. Desktop uses Context Panel */}
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">
                    Difficulty
                  </span>
                  <DifficultyIndicator level={currentDifficulty} />
                </div>
                <div className="w-24 sm:w-32">
                  <ProgressBar current={progress} total={100} />
                </div>
              </div>
            </motion.div>

            {/* Interaction Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6 lg:gap-8 items-start">
              {/* Avatar & Question */}
              <div className="flex flex-col gap-6 lg:sticky lg:top-4">
                <PixelAvatar state={avatarState} size="teaching" className="mx-auto lg:mx-0" animated />
                <div className="relative group w-full">
                  <div className="relative w-full">
                    <MessageBox
                      message={displayedQuestionText || "Loading..."}
                      variant="solid"
                      className="text-lg lg:text-xl leading-relaxed shadow-[4px_4px_0_0_rgba(0,0,0,1)] border-2 border-foreground w-full pt-6 text-center lg:text-left"
                    >
                      {/* Question Type Badge - Stacked Below */}
                      <div className="self-end mt-2">
                        <div className={cn(
                          "px-2 py-0.5 rounded-md text-[10px] font-bold border border-foreground/30 uppercase tracking-widest bg-surface/50",
                          questionType === 'diagnostic' ? "text-purple-600 border-purple-200" : "text-blue-600 border-blue-200"
                        )}>
                          {questionType === 'diagnostic' ? 'Diagnostic' : questionType}
                        </div>
                      </div>
                    </MessageBox>
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
                    Your Answer
                    {isEvaluating && <span className="text-sm font-normal text-muted-foreground animate-pulse">(Analyzing...)</span>}
                  </h3>

                  {/* Input Guidance & Controls */}
                  <div className="flex items-center gap-3">
                    {/* Guidance Text */}
                    {!isEvaluating && answer.length > 0 && inputMode === 'text' && (
                      <span className={cn(
                        "text-xs font-bold uppercase tracking-wider transition-colors",
                        (() => {
                          const wordCount = answer.trim().split(/\s+/).length;
                          const minWords = currentDifficulty === 'basic' ? 10 : currentDifficulty === 'intermediate' ? 30 : 50;
                          return wordCount < minWords ? "text-muted-foreground" : "text-green-600";
                        })()
                      )}>
                        {(() => {
                          const wordCount = answer.trim().split(/\s+/).length;
                          const minWords = currentDifficulty === 'basic' ? 20 : currentDifficulty === 'intermediate' ? 30 : 50;

                          if (wordCount < 5) return "Keep going...";
                          if (wordCount < minWords) return `${wordCount}/${minWords} words`;
                          return "Great length!";
                        })()}
                      </span>
                    )}

                    <div className="flex bg-gray-100 p-1 rounded-lg gap-2">
                      <button
                        onClick={() => setInputMode("voice")}
                        className={cn("p-2 rounded-md transition-all", inputMode === "voice" ? "bg-white shadow-sm border border-border-subtle" : "text-muted-foreground hover:bg-gray-200")}
                        title="Voice Input"
                      >
                        <Mic className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setInputMode("text")}
                        className={cn("p-2 rounded-md transition-all", inputMode === "text" ? "bg-white shadow-sm border border-border-subtle" : "text-muted-foreground hover:bg-gray-200")}
                        title="Text Input"
                      >
                        <Keyboard className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className={cn(
                  "relative min-h-[240px] flex-1 rounded-2xl p-1 transition-all duration-300 bg-surface border-2 border-dashed border-gray-300 focus-within:border-foreground focus-within:ring-0"
                )}>
                  <div className="relative h-full p-6 flex flex-col">
                    {inputMode === "voice" ? (
                      <div className="flex-1 flex flex-col items-center justify-center gap-6 py-8">
                        <div className="relative">
                          {isRecording && (
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-coral animate-pulse uppercase tracking-wider">Recording</span>
                          )}
                          <Waveform active={isRecording} className="scale-150" />
                        </div>
                        {answer ? (
                          <p className="text-lg text-foreground/80 leading-relaxed text-center max-w-md font-handwritten">"{answer}"</p>
                        ) : (
                          <p className="text-muted-foreground text-center text-sm">Press and hold to speak...</p>
                        )}
                      </div>
                    ) : (
                      <RetroTextArea
                        placeholder="Type your explanation here..."
                        value={answer}
                        onChange={e => setAnswer(e.target.value)}
                        rows={12}
                        className="bg-transparent border-none text-lg leading-loose font-handwritten resize-none focus:ring-0 p-0 h-full w-full"
                      />
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                  <RetroButton
                    onMouseDown={handleVoiceHold}
                    onMouseUp={handleVoiceRelease}
                    onMouseLeave={() => isRecording && handleVoiceRelease()}
                    onTouchStart={handleVoiceHold}
                    onTouchEnd={handleVoiceRelease}
                    variant="outline"
                    className={cn("flex-1 h-14", isEvaluating && "opacity-50 pointer-events-none")}
                    disabled={isEvaluating}
                  >
                    <div className="flex items-center gap-2 justify-center w-full">
                      <Mic className={cn("w-4 h-4", isRecording ? "text-coral animate-pulse" : "text-muted-foreground")} />
                      <span className="font-semibold">{isRecording ? "Listening..." : "Hold to Speak"}</span>
                    </div>
                  </RetroButton>

                  <RetroButton
                    onClick={handleSubmit}
                    disabled={!answer.trim() || isEvaluating}
                    variant="primary"
                    className={cn("flex-1 h-14", !answer.trim() && "opacity-50 cursor-not-allowed")}
                  >
                    {isEvaluating ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
                        <span>Analyzing...</span>
                      </div>
                    ) : "Submit Answer"}
                  </RetroButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Context Panel (Desktop Only) */}
        {/* Right: Context Panel (Desktop Only) */}
        <div className="hidden lg:flex z-30 h-full">
          <ContextPanel
            concept={concept!}
            currentDifficulty={currentDifficulty}
            progress={progress}
            className="h-full"
          />
        </div>
      </div>

      <RemediationPanel
        isOpen={showRemediation}
        onClose={() => setShowRemediation(false)}
        selectedRemediation={undefined}
        onSelectRemediation={handleRemediationSelect}
      />
    </div>
  );
};

export default TeachingScreen;