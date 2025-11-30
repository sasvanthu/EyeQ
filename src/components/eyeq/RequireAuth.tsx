import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

const RequireAuth: React.FC<{ roles?: string[]; children: React.ReactNode }> = ({ roles, children }) => {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate('/login');
      return;
    }

    if (roles && roles.length > 0) {
      // If profile is still loading, wait (handled by loading check above)
      // If loading is done but no profile, deny access
      if (!profile) {
        console.warn("User has no profile, denying access to protected route");
        navigate('/'); // Or redirect to a 'complete profile' page
        return;
      }

      if (!roles.includes(profile.role)) {
        navigate('/');
      }
    }
  }, [navigate, roles, user, profile, loading]);

  if (loading) {
    return <div>Loading...</div>; // Or a proper loader component
  }

  return <>{children}</>;
};

export default RequireAuth;
