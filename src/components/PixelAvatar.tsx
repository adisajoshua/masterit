import { motion, AnimatePresence, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";
import PixelFace from "@/assets/pixel-avatar.svg";

export type AvatarState = "idle" | "listening" | "thinking" | "speaking" | "celebrating" | "confused";

interface PixelAvatarProps {
  state?: AvatarState;
  size?: "sm" | "md" | "lg" | "xl";
  message?: string;
  showSpeechBubble?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32",
  xl: "w-48 h-48",
};

const stateAnimations: Record<AvatarState, { scale?: number | number[]; rotate?: number[]; y?: number[]; transition: Transition }> = {
  idle: {
    scale: [1, 1.02, 1],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const },
  },
  listening: {
    scale: 1.05,
    rotate: [0, -3, 3, 0],
    transition: { duration: 0.5 },
  },
  thinking: {
    rotate: [0, -5, 0],
    y: [0, -5, 0],
    transition: { duration: 2, repeat: Infinity },
  },
  speaking: {
    scale: [1, 1.03, 1],
    transition: { duration: 0.3, repeat: Infinity },
  },
  celebrating: {
    y: [0, -20, 0],
    rotate: [0, -10, 10, 0],
    scale: [1, 1.1, 1],
    transition: { duration: 0.6, repeat: Infinity },
  },
  confused: {
    rotate: [0, 15, 0],
    transition: { duration: 1.5, repeat: Infinity },
  },
};

const PixelAvatar = ({
  state = "idle",
  size = "lg",
  message,
  showSpeechBubble = false,
  className,
}: PixelAvatarProps) => {
  const animation = stateAnimations[state];
  
  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      {/* Speech Bubble */}
      <AnimatePresence>
        {showSpeechBubble && message && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute -top-4 left-1/2 -translate-x-1/2 -translate-y-full z-10"
          >
            <div className="relative bg-card neu-flat rounded-2xl px-4 py-3 max-w-[280px]">
              <p className="text-sm text-foreground leading-relaxed">{message}</p>
              {/* Speech bubble tail */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-card" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar Container */}
      <motion.div
        animate={{
          scale: animation.scale,
          rotate: animation.rotate,
          y: animation.y,
        }}
        transition={animation.transition}
        className={cn(
          "relative rounded-full neu-convex p-3 flex items-center justify-center",
          sizeClasses[size]
        )}
      >
        {/* The Pixel Face */}
        <img
          src={PixelFace}
          alt="Pixel the study buddy"
          className="w-full h-full object-contain"
        />

        {/* State-specific overlays */}
        <AnimatePresence>
          {state === "thinking" && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute -top-2 -right-2"
            >
              <motion.span
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-2xl"
              >
                🤔
              </motion.span>
            </motion.div>
          )}

          {state === "confused" && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute -top-2 -right-2"
            >
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-2xl"
              >
                ❓
              </motion.span>
            </motion.div>
          )}

          {state === "celebrating" && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute -top-4 left-0"
              >
                <motion.span
                  animate={{ y: [0, -10, 0], rotate: [0, 20, -20, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="text-xl"
                >
                  ✨
                </motion.span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute -top-4 right-0"
              >
                <motion.span
                  animate={{ y: [0, -10, 0], rotate: [0, -20, 20, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                  className="text-xl"
                >
                  ⭐
                </motion.span>
              </motion.div>
            </>
          )}

          {state === "speaking" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -bottom-1 -right-1"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="w-6 h-6 rounded-full bg-turquoise/20 flex items-center justify-center"
              >
                <div className="w-3 h-3 rounded-full bg-turquoise" />
              </motion.div>
            </motion.div>
          )}

          {state === "listening" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -bottom-1 -right-1"
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="w-6 h-6 rounded-full bg-coral/20 flex items-center justify-center"
              >
                <div className="w-2 h-2 rounded-full bg-coral" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PixelAvatar;
