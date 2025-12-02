import { useAuth } from "@/lib/auth";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { LoaderOne } from "@/components/ui/loader";

interface RequireAuthProps {
  children: JSX.Element;
  roles?: string[]; // 'admin', 'member', etc.
}

const RequireAuth = ({ children, roles }: RequireAuthProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (data) {
          setUserRole(data.role);
        } else {
          console.error("Error fetching role:", error);
        }
      }
      setRoleLoading(false);
    };

    if (!loading) {
      fetchRole();
    }
  }, [user, loading]);

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <LoaderOne />
      </div>
    );
  }

  if (!user) {
    // Redirect to appropriate login based on attempted path
    if (location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin-login" state={{ from: location }} replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && userRole) {
    // Normalize roles to lowercase for comparison
    const requiredRoles = roles.map(r => r.toLowerCase());
    const currentRole = userRole.toLowerCase();

    if (!requiredRoles.includes(currentRole)) {
      // If user is logged in but doesn't have the right role
      if (currentRole === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
      }
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default RequireAuth;
