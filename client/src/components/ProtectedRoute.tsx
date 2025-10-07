// src/components/ProtectedRoute.tsx
import { useAuth } from '../contexts/AuthContext'; // Import từ contexts
import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean; // Optional: Chỉ admin mới vào
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    // Redirect về login user mặc định nếu chưa auth
    return <Navigate to="/userLogin" replace />;
  }

  if (requireAdmin && !isAdmin) {
    // Nếu cần admin nhưng không phải, redirect về trang user
    return <Navigate to="/information" replace />;
  }

  return <>{children}</>;
};