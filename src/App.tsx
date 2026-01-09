import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import WelcomeScreen from "./pages/WelcomeScreen";
import MaterialScreen from "./pages/MaterialScreen";
import ProcessingScreen from "./pages/ProcessingScreen";
import ConceptsScreen from "./pages/ConceptsScreen";
import TeachingScreen from "./pages/TeachingScreen";
import SummaryScreen from "./pages/SummaryScreen";
import ReviewScreen from "./pages/ReviewScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="/material" element={<MaterialScreen />} />
            <Route path="/processing" element={<ProcessingScreen />} />
            <Route path="/concepts" element={<ConceptsScreen />} />
            <Route path="/teaching" element={<TeachingScreen />} />
            <Route path="/summary" element={<SummaryScreen />} />
            <Route path="/review" element={<ReviewScreen />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
