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
  // TEMPORARY: Bypass all auth checks for testing
  return children;
};

export default RequireAuth;
