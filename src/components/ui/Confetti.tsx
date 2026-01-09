import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiProps {
  active: boolean;
  duration?: number;
}

const colors = [
  "hsl(var(--coral))",
  "hsl(var(--turquoise))",
  "hsl(var(--gold))",
  "hsl(var(--sky-blue))",
  "hsl(var(--mint))",
];

const Confetti = ({ active, duration = 3000 }: ConfettiProps) => {
  const [pieces, setPieces] = useState<Array<{
    id: number;
    x: number;
    color: string;
    delay: number;
    rotation: number;
  }>>([]);
  
  useEffect(() => {
    if (active) {
      const newPieces = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        rotation: Math.random() * 720 - 360,
      }));
      setPieces(newPieces);
      
      const timer = setTimeout(() => setPieces([]), duration);
      return () => clearTimeout(timer);
    }
  }, [active, duration]);
  
  return (
    <AnimatePresence>
      {pieces.length > 0 && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              className="absolute w-3 h-3 rounded-sm"
              style={{
                left: `${piece.x}%`,
                top: -20,
                backgroundColor: piece.color,
              }}
              initial={{ y: 0, rotate: 0, opacity: 1 }}
              animate={{
                y: window.innerHeight + 100,
                rotate: piece.rotation,
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 2.5 + Math.random(),
                delay: piece.delay,
                ease: "easeIn",
              }}
              exit={{ opacity: 0 }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export default Confetti;
