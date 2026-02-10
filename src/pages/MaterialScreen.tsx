import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PixelAvatar from "@/components/PixelAvatar";
import MessageBox from "@/components/ui/MessageBox";
import RetroButton from "@/components/retro-ui/RetroButton";
import RetroTextArea from "@/components/retro-ui/RetroTextArea";
import ModeChip from "@/components/ui/ModeChip";
import BackNavigation from "@/components/ui/BackNavigation";
import { useApp } from "@/context/AppContext";
import { mockSession } from "@/data/mockData";

const MaterialScreen = () => {
  const navigate = useNavigate();
  const { userName, studyMaterial, setStudyMaterial } = useApp();
  const [localStudyMaterial, setLocalStudyMaterial] = useState(studyMaterial);

  const handleStartTeaching = () => {
    if (localStudyMaterial.length >= 100) {
      setStudyMaterial(localStudyMaterial);
      navigate("/processing");
    }
  };

  const handleUseSample = () => {
    setLocalStudyMaterial(mockSession.sourceText);
  };

  return (
    <div className="min-h-screen bg-background grid-bg flex flex-col">
      <BackNavigation backTo="/" backLabel="Back to Welcome" />
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
        <div className="flex flex-col lg:flex-row gap-8 items-start flex-1 mt-28">
          {/* Avatar section - horizontal on mobile/tablet, vertical on desktop */}
          {/* Avatar section - vertical stacking on all screen sizes */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-1/3 flex flex-col items-center gap-4 lg:sticky lg:top-8"
          >
            <PixelAvatar state="thinking" size="setup" className="flex-shrink-0" />
            <MessageBox
              message="Paste your study material below. I'll read it and we'll practice together!"
              variant="dotted"
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

            <RetroTextArea
              placeholder="Paste your study material here... (minimum 100 characters)"
              value={localStudyMaterial}
              onChange={(e) => setLocalStudyMaterial(e.target.value)}
              maxLength={5000}
              showCount
              rows={12}
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <RetroButton
                onClick={handleStartTeaching}
                disabled={localStudyMaterial.length < 100}
                variant="primary"
                className="flex-1"
              >
                Start Teaching
              </RetroButton>

              <RetroButton
                onClick={handleUseSample}
                variant="outline"
                className="sm:w-auto"
              >
                Use Sample (Evolution)
              </RetroButton>
            </div>

            {localStudyMaterial.length > 0 && localStudyMaterial.length < 100 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-muted-foreground text-center"
              >
                {100 - localStudyMaterial.length} more characters needed
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MaterialScreen;
