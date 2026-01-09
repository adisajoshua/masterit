import { cn } from "@/lib/utils";

interface WaveformProps {
  active?: boolean;
  className?: string;
}

const Waveform = ({ active = true, className }: WaveformProps) => {
  return (
    <span className={cn(
      "inline-flex items-center justify-center gap-0.5 h-6",
      active && "waveform",
      className
    )}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={cn(
            "w-1 rounded-full transition-all",
            active ? "bg-coral" : "bg-muted h-2"
          )}
          style={!active ? { height: '8px' } : undefined}
        />
      ))}
    </span>
  );
};

export default Waveform;
