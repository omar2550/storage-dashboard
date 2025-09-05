// src/layouts/ProtectedLayout.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>جاري التحميل...</div>;

  if (!user) return <Navigate to="/auth" replace />;

  return <Outlet />;
}
