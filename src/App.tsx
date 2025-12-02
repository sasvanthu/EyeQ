import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
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
import Gallery from './pages/Gallery';
import AdminGallery from './pages/admin/Gallery';
import MemberLayout from '@/components/eyeq/MemberLayout';
import AdminLayout from '@/components/eyeq/AdminLayout';
import DashboardHome from './pages/member/DashboardHome';
import Projects from './pages/member/Projects';
import ProjectUpload from './pages/member/ProjectUpload';
import LearningLog from './pages/member/LearningLog';
import Profile from './pages/member/Profile';
import AccessPortal from './pages/member/AccessPortal';
import Leaderboard from './pages/member/Leaderboard';
import RequireAuth from '@/components/eyeq/RequireAuth';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import { AuthProvider } from "@/lib/auth";
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
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />

              {/* Member Routes */}
              <Route path="/portal" element={<RequireAuth><AccessPortal /></RequireAuth>} />
              <Route path="/dashboard" element={<RequireAuth><MemberLayout><DashboardHome /></MemberLayout></RequireAuth>} />
              <Route path="/projects" element={<RequireAuth><MemberLayout><Projects /></MemberLayout></RequireAuth>} />
              <Route path="/projects/new" element={<RequireAuth><MemberLayout><ProjectUpload /></MemberLayout></RequireAuth>} />
              <Route path="/learning" element={<RequireAuth><MemberLayout><LearningLog /></MemberLayout></RequireAuth>} />
              <Route path="/profile" element={<RequireAuth><MemberLayout><Profile /></MemberLayout></RequireAuth>} />
              <Route path="/leaderboard" element={<RequireAuth><MemberLayout><Leaderboard /></MemberLayout></RequireAuth>} />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<RequireAuth roles={["Admin"]}><AdminLayout><Dashboard /></AdminLayout></RequireAuth>} />
              <Route
                path="/admin/members"
                element={<RequireAuth roles={["Admin"]}><AdminLayout><MemberApproval /></AdminLayout></RequireAuth>}
              />
              <Route path="/admin/members/:id" element={<RequireAuth roles={["Admin"]}><AdminLayout><MemberProfile /></AdminLayout></RequireAuth>} />
              <Route
                path="/admin/events"
                element={<RequireAuth roles={["Admin"]}><AdminLayout><Events /></AdminLayout></RequireAuth>}
              />
              <Route
                path="/admin/analytics"
                element={<RequireAuth roles={["Admin"]}><AdminLayout><Analytics /></AdminLayout></RequireAuth>}
              />
              <Route
                path="/admin/chat"
                element={<RequireAuth roles={["Admin"]}><AdminLayout><Chat /></AdminLayout></RequireAuth>}
              />
              <Route
                path="/admin/portfolio"
                element={<RequireAuth roles={["Admin"]}><AdminLayout><Portfolio /></AdminLayout></RequireAuth>}
              />
              <Route
                path="/admin/alumni"
                element={<RequireAuth roles={["Admin"]}><AdminLayout><Alumni /></AdminLayout></RequireAuth>}
              />
              <Route
                path="/admin/gallery"
                element={<RequireAuth roles={["Admin"]}><AdminLayout><AdminGallery /></AdminLayout></RequireAuth>}
              />
              <Route path="/gallery" element={<Gallery />} />
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