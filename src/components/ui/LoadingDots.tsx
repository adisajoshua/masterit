import { cn } from "@/lib/utils";

interface LoadingDotsProps {
  className?: string;
}

const LoadingDots = ({ className }: LoadingDotsProps) => {
  return (
    <span className={cn("loading-dots inline-flex gap-1", className)}>
      <span className="w-2 h-2 rounded-full bg-current" />
      <span className="w-2 h-2 rounded-full bg-current" />
      <span className="w-2 h-2 rounded-full bg-current" />
    </span>
  );
};

export default LoadingDots;
