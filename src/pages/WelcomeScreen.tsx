import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PixelAvatar from "@/components/PixelAvatar";
import MessageBox from "@/components/ui/MessageBox";
import NeumorphicButton from "@/components/neumorphic/NeumorphicButton";
import NeumorphicInput from "@/components/neumorphic/NeumorphicInput";
import { useApp } from "@/context/AppContext";
import introSplashGif from "@/assets/intro-splash.gif";

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { userName, setUserName } = useApp();
  const [showSplash, setShowSplash] = useState(true);
  const [showInput, setShowInput] = useState(false);

  const handleContinue = () => {
    if (userName.length >= 2) {
      navigate("/material");
    }
  };

  return (
    <div className="min-h-screen bg-background grid-bg flex flex-col items-center justify-center p-6">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            onAnimationComplete={(definition) => {
              if (definition === "exit") setShowSplash(false);
            }}
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: '#FFFAE9' }}
          >
            <img
              src={introSplashGif}
              alt="MasterIt Loading"
              className="w-80 h-auto"
              onLoad={() => {
                // Start fade-out after GIF plays (adjust timing as needed)
                setTimeout(() => setShowSplash(false), 2500);
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-6 max-w-md w-full"
          >
        {!showInput ? (
          <>
            {/* Heading and subtext ABOVE mascot */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center space-y-2"
            >
              <h1 className="text-3xl font-display font-bold text-foreground">
                Welcome to <span className="text-coral">MasterIt</span>
              </h1>
              <p className="text-muted-foreground">
                The best way to learn is to teach. Let's get started!
              </p>
            </motion.div>

            {/* Mascot block - stacked vertically */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col items-center gap-4"
            >
              <PixelAvatar
                state="idle"
                size="welcome"
              />
              <MessageBox
                message="Hey there! I'm Pixel, your study buddy. Teaching me helps YOU learn better!"
                variant="dotted"
              />
            </motion.div>

            {/* CTA button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <NeumorphicButton
                onClick={() => setShowInput(true)}
              >
                Let's Go!
              </NeumorphicButton>
            </motion.div>
          </>
        ) : (
          <>
            {/* Mascot block for input state */}
            <div className="flex flex-col items-center gap-4">
              <PixelAvatar
                state="idle"
                size="welcome"
              />
              <MessageBox
                message={`Nice to meet you${userName ? `, ${userName}` : ""}! Ready to become the teacher?`}
                variant="dotted"
              />
            </div>

            {/* Name input section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full space-y-6"
            >
              <div className="text-center">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  What should I call you?
                </h2>
              </div>

              <NeumorphicInput
                placeholder="Enter your name..."
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                autoFocus
              />

              <NeumorphicButton
                onClick={handleContinue}
                disabled={userName.length < 2}
                variant="primary"
                className="w-full"
              >
                Continue
              </NeumorphicButton>
            </motion.div>
          </>
          )}
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WelcomeScreen;
