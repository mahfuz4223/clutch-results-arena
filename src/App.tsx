
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TournamentProvider } from "@/context/TournamentContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Tournaments from "./pages/Tournaments";
import CreateTournament from "./pages/CreateTournament";
import TournamentDashboard from "./pages/TournamentDashboard";
import TeamsPage from "./pages/TeamsPage";
import MatchesPage from "./pages/MatchesPage";
import ResultsPage from "./pages/ResultsPage";
import ExportPage from "./pages/ExportPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <TournamentProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/create" element={<CreateTournament />} />
            <Route path="/tournament/:id" element={<TournamentDashboard />} />
            <Route path="/tournament/:id/teams" element={<TeamsPage />} />
            <Route path="/tournament/:id/matches" element={<MatchesPage />} />
            <Route path="/tournament/:id/results" element={<ResultsPage />} />
            <Route path="/tournament/:id/export" element={<ExportPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TournamentProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
