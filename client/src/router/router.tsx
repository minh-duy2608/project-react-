// src/router.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminRegisterPage from "../pages/admin/AdminRegisterPage";
import Dashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import Category from "../pages/admin/Category"; // Thêm import Category
import UserLoginPage from "../pages/user/UserLoginPage";
import UserRegisterPage from "../pages/user/UserRegisterPage";
import InformationPage from "../pages/user/InformationPage";
import { ProtectedRoute } from "../components/ProtectedRoute"; 

export const router = createBrowserRouter([
  {
    path: "/adminLogin",
    element: <AdminLoginPage />, 
  },
  {
    path: "/adminRegister",
    element: <AdminRegisterPage />, 
  },
  {
    path: "/userLogin",
    element: <UserLoginPage />, 
  },
  {
    path: "/userRegister",
    element: <UserRegisterPage />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute requireAdmin={true}>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/users",
    element: (
      <ProtectedRoute requireAdmin={true}> 
        <Users />
      </ProtectedRoute>
    ),
  },
  {
    path: "/category", // Thêm route cho Category
    element: (
      <ProtectedRoute requireAdmin={true}>
        <Category />
      </ProtectedRoute>
    ),
  },
  {
    path: "/information",
    element: (
      <ProtectedRoute> 
        <InformationPage />
      </ProtectedRoute>
    ),
  },
  
  {
    path: "/",
    element: <Navigate to="/userLogin" replace />,
  },
  // Uncomment nếu bạn có trang NotFound
  // {
  //   path: "*",
  //   element: <NotFound />,
  // },
]);