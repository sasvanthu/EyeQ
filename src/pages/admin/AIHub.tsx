// AIHub removed - placeholder route for compatibility
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AIHub: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => { navigate('/admin/dashboard'); }, [navigate]);
  return null;
};

export default AIHub;
