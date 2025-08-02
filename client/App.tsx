import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TeamSelectionHub from "./pages/TeamSelectionHub";
import TeamSetup from "./pages/TeamSetup";
import SquadManagement from "./pages/SquadManagement";
import Formation from "./pages/Formation";
import Apps from "./pages/Apps";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="dark">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/choose-team" element={<TeamSelectionHub />} />
            <Route path="/team-setup/:teamId" element={<TeamSetup />} />
            <Route
              path="/squad-management/:teamId"
              element={<SquadManagement />}
            />
            <Route path="/formation" element={<Formation />} />
            <Route path="/apps" element={<Apps />} />
            <Route path="/profile" element={<Profile />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
