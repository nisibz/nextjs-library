"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { loadFromStorage } from "@/store/authSlice";
import type { RootState } from "@/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    dispatch(loadFromStorage());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated && !token) {
      router.push("/login");
    }
  }, [isAuthenticated, token, router]);

  if (!isAuthenticated && !token) {
    return null;
  }

  return <>{children}</>;
}
