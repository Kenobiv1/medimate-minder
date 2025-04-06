
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Medications from "./pages/Medications";
import History from "./pages/History";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<ProtectedRoute requireAuth={false}><Index /></ProtectedRoute>} />
              <Route path="/medications" element={<ProtectedRoute requireAuth={false}><Medications /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute requireAuth={false}><History /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute requireAuth={false}><Settings /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute requireAuth={false}><Analytics /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
