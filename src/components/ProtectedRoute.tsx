// src/components/ProtectedRoute.tsx
import { getAuth } from "firebase/auth";
import { useEffect, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserRoleEnum } from "../enums/UserRoleEnum";
import { selectSessionUser } from "../store/reducers/session";
import { useAppSelector } from "../store/store";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const auth = getAuth();
  const userData = useAppSelector(selectSessionUser);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          if (
            !userData ||
            (userData?.role !== UserRoleEnum.Admin &&
              userData?.role !== UserRoleEnum.OrgAdmin)
          ) {
            await auth.signOut();
            return <Navigate to="/login" replace />;
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
