import { useAuth } from "@/lib/auth";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchMember } from "@/lib/api";
import { LoaderOne } from "@/components/ui/loader";

interface RequireAuthProps {
  children: JSX.Element;
  roles?: string[]; // 'admin', 'member', etc.
}

const RequireAuth = ({ children, roles }: RequireAuthProps) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoaderOne />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && roles.length > 0) {
    const hasRequiredRole = roles.some(role => {
      if (role === 'admin') return isAdmin;
      if (role === 'member') return !isAdmin;
      return false;
    });

    if (!hasRequiredRole) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default RequireAuth;
