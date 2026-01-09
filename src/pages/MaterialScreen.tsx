import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PixelAvatar from "@/components/PixelAvatar";
import NeumorphicButton from "@/components/neumorphic/NeumorphicButton";
import NeumorphicTextArea from "@/components/neumorphic/NeumorphicTextArea";
import ModeChip from "@/components/ui/ModeChip";
import { useApp } from "@/context/AppContext";
import { mockSession } from "@/data/mockData";

const MaterialScreen = () => {
  const navigate = useNavigate();
  const { userName, studyMaterial, setStudyMaterial } = useApp();

  const handleStartTeaching = () => {
    if (studyMaterial.length >= 100) {
      navigate("/processing");
    }
  };

  const handleUseSample = () => {
    setStudyMaterial(mockSession.sourceText);
  };

  return (
    <div className="min-h-screen bg-background grid-bg flex flex-col">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <ModeChip mode="setup" />
          <p className="text-muted-foreground text-sm">
            Hi, <span className="text-coral font-medium">{userName}</span>!
          </p>
        </motion.div>

        {/* Main content - Avatar left, Content right */}
        <div className="flex flex-col lg:flex-row gap-8 items-start flex-1 mt-16">
          {/* Avatar section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:w-1/3 flex flex-col items-center lg:sticky lg:top-8"
          >
            <PixelAvatar
              state="listening"
              size="lg"
              showSpeechBubble
              message="Paste your study material below. I'll read it and we'll practice together!"
            />
          </motion.div>

          {/* Input section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:w-2/3 space-y-6"
          >
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground mb-2">
                What are you studying?
              </h1>
              <p className="text-muted-foreground">
                Paste your notes, textbook content, or any material you want to master.
              </p>
            </div>

            <NeumorphicTextArea
              placeholder="Paste your study material here... (minimum 100 characters)"
              value={studyMaterial}
              onChange={(e) => setStudyMaterial(e.target.value)}
              maxLength={5000}
              showCount
              rows={12}
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <NeumorphicButton
                onClick={handleStartTeaching}
                disabled={studyMaterial.length < 100}
                variant="primary"
                className="flex-1"
              >
                Start Teaching
              </NeumorphicButton>

              <NeumorphicButton
                onClick={handleUseSample}
                variant="outline"
                className="sm:w-auto"
              >
                Use Sample (Evolution)
              </NeumorphicButton>
            </div>

            {studyMaterial.length > 0 && studyMaterial.length < 100 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-muted-foreground text-center"
              >
                {100 - studyMaterial.length} more characters needed
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MaterialScreen;
