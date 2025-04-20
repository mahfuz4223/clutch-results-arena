
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TournamentProvider } from "@/context/TournamentContext";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Tournaments from "./pages/Tournaments";
import CreateTournament from "./pages/CreateTournament";
import TournamentDashboard from "./pages/TournamentDashboard";
import TeamsPage from "./pages/TeamsPage";
import MatchesPage from "./pages/MatchesPage";
import ResultsPage from "./pages/ResultsPage";
import ExportPage from "./pages/ExportPage";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <TournamentProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Protected Routes */}
              <Route path="/tournaments" element={<ProtectedRoute><Tournaments /></ProtectedRoute>} />
              <Route path="/create" element={<ProtectedRoute><CreateTournament /></ProtectedRoute>} />
              <Route path="/tournament/:id" element={<ProtectedRoute><TournamentDashboard /></ProtectedRoute>} />
              <Route path="/tournament/:id/teams" element={<ProtectedRoute><TeamsPage /></ProtectedRoute>} />
              <Route path="/tournament/:id/matches" element={<ProtectedRoute><MatchesPage /></ProtectedRoute>} />
              <Route path="/tournament/:id/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
              <Route path="/tournament/:id/export" element={<ProtectedRoute><ExportPage /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TournamentProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
