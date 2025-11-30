import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/admin/Dashboard";
import MemberApproval from "./pages/admin/MemberApproval";
import MemberProfile from './pages/admin/MemberProfile';
import Events from "./pages/admin/Events";
import Analytics from "./pages/admin/Analytics";
import Chat from "./pages/admin/Chat";
import Portfolio from './pages/admin/Portfolio';
import Alumni from './pages/admin/Alumni';
import RequireAuth from '@/components/eyeq/RequireAuth';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import { AuthProvider } from "@/lib/auth";
import { useEffect } from "react";
import scrollFX from "@/lib/scrollFX";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize scroll animations after React has rendered
    const timer = setTimeout(() => {
      try {
        scrollFX.init();
      } catch (e) {
        console.error("scrollFX init failed:", e);
      }
    }, 100); // Small delay to ensure DOM is fully ready

    return () => {
      scrollFX.destroy();
      clearTimeout(timer);
    };
  }, []);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white p-4">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-500">Configuration Error</h1>
          <p>Supabase credentials are missing from the environment variables.</p>
          <p className="text-sm text-neutral-400">
            Please ensure <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> are set in your <code>.env</code> file.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin/dashboard" element={<RequireAuth roles={["Admin"]}><Dashboard /></RequireAuth>} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route
                path="/admin/members"
                element={<RequireAuth roles={["Admin"]}><MemberApproval /></RequireAuth>}
              />
              <Route path="/admin/members/:id" element={<RequireAuth roles={["Admin"]}><MemberProfile /></RequireAuth>} />
              <Route
                path="/admin/events"
                element={<RequireAuth roles={["Admin"]}><Events /></RequireAuth>}
              />
              <Route
                path="/admin/analytics"
                element={<RequireAuth roles={["Admin"]}><Analytics /></RequireAuth>}
              />
              <Route
                path="/admin/chat"
                element={<RequireAuth roles={["Admin"]}><Chat /></RequireAuth>}
              />
              <Route
                path="/admin/portfolio"
                element={<RequireAuth roles={["Admin"]}><Portfolio /></RequireAuth>}
              />
              <Route
                path="/admin/alumni"
                element={<RequireAuth roles={["Admin"]}><Alumni /></RequireAuth>}
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default App;