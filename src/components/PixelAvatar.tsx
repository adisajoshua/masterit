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
  size?: "sm" | "md" | "lg" | "xl" | "welcome" | "setup" | "teaching" | "summary-web";
  className?: string;
  animated?: boolean;
}

// Screen-specific sizes for different contexts
const sizeClasses = {
  sm: "w-20 h-20",
  md: "w-28 h-28",
  lg: "w-40 h-40",
  xl: "w-56 h-56",
  // Custom sizes per screen
  welcome: "w-[13.5rem] h-[13.5rem]",
  // 216px (~35% increase from lg)
  setup: "w-48 h-48",
  // 192px (~20% increase from lg)
  teaching: "w-[11.5rem] h-[11.5rem]",
  // 184px (~15% increase from lg)
  "summary-web": "w-44 h-44" // 176px (~10% increase from lg for web)
};

// Map each state to its corresponding SVG
const stateImages: Record<AvatarState, string> = {
  idle: DefaultFace,
  listening: ConfusedFace,
  thinking: SpeakingFace,
  // Using speaking.svg for thinking/understanding on setup screens
  speaking: SpeakingFace,
  celebrating: CelebrationFace,
  confused: ConfusedFace
};

// Subtle animations for each state - complements the expressive SVGs
const stateAnimations: Record<AvatarState, {
  scale?: number | number[];
  rotate?: number[];
  y?: number[];
  transition: Transition;
}> = {
  idle: {
    y: [0, -3, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  },
  listening: {
    scale: [1, 1.02, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  },
  thinking: {
    rotate: [0, -3, 0],
    y: [0, -4, 0],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  },
  speaking: {
    scale: [1, 1.03, 1],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  },
  celebrating: {
    y: [0, -8, 0],
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  },
  confused: {
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }
};
const PixelAvatar = ({
  state = "idle",
  size = "lg",
  className,
  animated = false
}: PixelAvatarProps) => {
  const animation = stateAnimations[state];
  const imageSrc = stateImages[state];
  return <div className={cn("relative flex flex-col items-center", className)}>
      {/* Avatar - No container, direct SVG display */}
      {animated ? <motion.div animate={{
      scale: animation.scale,
      rotate: animation.rotate,
      y: animation.y
    }} transition={animation.transition} className={cn("relative flex items-center justify-center overflow-visible", sizeClasses[size])}>
          <AnimatePresence mode="wait">
            <motion.img key={state} src={imageSrc} alt="Pixel the study buddy" initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} exit={{
          opacity: 0,
          scale: 0.9
        }} transition={{
          duration: 0.2
        }} className="w-full h-full object-visible" />
          </AnimatePresence>
        </motion.div> : <div className={cn("relative flex items-center justify-center overflow-visible", sizeClasses[size])}>
          <img src={imageSrc} alt="Pixel the study buddy" className="w-full h-full object-contain" />
        </div>}
    </div>;
};
export default PixelAvatar;