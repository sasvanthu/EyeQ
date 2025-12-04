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
import MembersList from './pages/admin/MembersList';
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
import AdminLogin from './pages/auth/AdminLogin';
import Signup from './pages/auth/Signup';
import JoinUs from './pages/JoinUs';
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

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/join-us" element={<JoinUs />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin-login" element={<AdminLogin />} />

              {/* Member Routes - Protected */}
              <Route path="/portal" element={<RequireAuth roles={["member", "admin"]}><AccessPortal /></RequireAuth>} />
              <Route path="/dashboard" element={<RequireAuth roles={["member", "admin"]}><MemberLayout><DashboardHome /></MemberLayout></RequireAuth>} />
              <Route path="/projects" element={<RequireAuth roles={["member", "admin"]}><MemberLayout><Projects /></MemberLayout></RequireAuth>} />
              <Route path="/projects/new" element={<RequireAuth roles={["member", "admin"]}><MemberLayout><ProjectUpload /></MemberLayout></RequireAuth>} />
              <Route path="/learning" element={<RequireAuth roles={["member", "admin"]}><MemberLayout><LearningLog /></MemberLayout></RequireAuth>} />
              <Route path="/profile" element={<RequireAuth roles={["member", "admin"]}><MemberLayout><Profile /></MemberLayout></RequireAuth>} />
              <Route path="/leaderboard" element={<RequireAuth roles={["member", "admin"]}><MemberLayout><Leaderboard /></MemberLayout></RequireAuth>} />

              {/* Admin Routes - Strictly Protected */}
              <Route path="/admin/dashboard" element={<RequireAuth roles={["admin"]}><AdminLayout><Dashboard /></AdminLayout></RequireAuth>} />
              <Route
                path="/admin/members"
                element={<RequireAuth roles={["admin"]}><AdminLayout><MemberApproval /></AdminLayout></RequireAuth>}
              />
              <Route
                path="/admin/users"
                element={<RequireAuth roles={["admin"]}><AdminLayout><MembersList /></AdminLayout></RequireAuth>}
              />
              <Route path="/admin/members/:id" element={<RequireAuth roles={["admin"]}><AdminLayout><MemberProfile /></AdminLayout></RequireAuth>} />
              <Route
                path="/admin/events"
                element={<RequireAuth roles={["admin"]}><AdminLayout><Events /></AdminLayout></RequireAuth>}
              />
              <Route
                path="/admin/analytics"
                element={<RequireAuth roles={["admin"]}><AdminLayout><Analytics /></AdminLayout></RequireAuth>}
              />
              <Route
                path="/admin/chat"
                element={<RequireAuth roles={["admin"]}><AdminLayout><Chat /></AdminLayout></RequireAuth>}
              />
              <Route
                path="/admin/portfolio"
                element={<RequireAuth roles={["admin"]}><AdminLayout><Portfolio /></AdminLayout></RequireAuth>}
              />
              <Route
                path="/admin/alumni"
                element={<RequireAuth roles={["admin"]}><AdminLayout><Alumni /></AdminLayout></RequireAuth>}
              />
              <Route
                path="/admin/gallery"
                element={<RequireAuth roles={["admin"]}><AdminLayout><AdminGallery /></AdminLayout></RequireAuth>}
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