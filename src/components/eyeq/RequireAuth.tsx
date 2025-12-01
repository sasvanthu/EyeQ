import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

const RequireAuth: React.FC<{ roles?: string[]; children: React.ReactNode }> = ({ roles, children }) => {
  // Login setup removed as per user request.
  // Bypassing all auth checks and rendering children directly.
  return <>{children}</>;
};

export default RequireAuth;
