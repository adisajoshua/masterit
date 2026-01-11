import { motion, AnimatePresence, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";

// Import mascot SVG variants
import DefaultFace from "@/assets/mascot/default.svg";
import ConfusedFace from "@/assets/mascot/confused.svg";
import CelebrationFace from "@/assets/mascot/celebration.svg";
import SpeakingFace from "@/assets/mascot/speaking.svg";

export type AvatarState = "idle" | "listening" | "thinking" | "speaking" | "celebrating" | "confused";

interface PixelAvatarProps {
  state?: AvatarState;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32",
  xl: "w-48 h-48",
};

// Map each state to its corresponding SVG
const stateImages: Record<AvatarState, string> = {
  idle: DefaultFace,
  listening: ConfusedFace,
  thinking: ConfusedFace,
  speaking: SpeakingFace,
  celebrating: CelebrationFace,
  confused: ConfusedFace,
};

// Subtle animations for each state - complements the expressive SVGs
const stateAnimations: Record<AvatarState, { scale?: number | number[]; rotate?: number[]; y?: number[]; transition: Transition }> = {
  idle: {
    y: [0, -3, 0],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const },
  },
  listening: {
    scale: [1, 1.02, 1],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const },
  },
  thinking: {
    rotate: [0, -3, 0],
    y: [0, -4, 0],
    transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" as const },
  },
  speaking: {
    scale: [1, 1.03, 1],
    transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" as const },
  },
  celebrating: {
    y: [0, -8, 0],
    scale: [1, 1.05, 1],
    transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" as const },
  },
  confused: {
    rotate: [0, 5, -5, 0],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const },
  },
};

const PixelAvatar = ({
  state = "idle",
  size = "lg",
  className,
}: PixelAvatarProps) => {
  const animation = stateAnimations[state];
  const imageSrc = stateImages[state];
  
  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      {/* Avatar Container - Gumroad style with border */}
      <motion.div
        animate={{
          scale: animation.scale,
          rotate: animation.rotate,
          y: animation.y,
        }}
        transition={animation.transition}
        className={cn(
          "relative rounded-full bg-surface border border-foreground p-3 flex items-center justify-center",
          sizeClasses[size]
        )}
      >
        {/* Crossfade between mascot SVGs */}
        <AnimatePresence mode="wait">
          <motion.img
            key={state}
            src={imageSrc}
            alt="Pixel the study buddy"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full object-contain"
          />
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PixelAvatar;
