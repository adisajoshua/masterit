import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface BackNavigationProps {
  backTo: string;
  backLabel: string;
  rightContent?: React.ReactNode;
}

const BackNavigation = ({ backTo, backLabel, rightContent }: BackNavigationProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/20"
    >
      <div className="container mx-auto px-4 py-3 max-w-5xl flex items-center justify-between">
        <button
          onClick={() => navigate(backTo)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
          <span>{backLabel}</span>
        </button>

        {rightContent && (
          <div className="flex items-center gap-4">
            {rightContent}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BackNavigation;
