"use client";

import { useEffect } from "react";
import store from "@/redux/store";
import { Provider } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { Toaster } from "sonner";
import { setUser, setToken } from "@/redux/feature/authSlice";
import { getTokenExpiryMs } from "@/lib/jwt";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Initialize auth state from localStorage on mount
    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");

    if (token) {
      store.dispatch(setToken(token));
    }

    if (user) {
      try {
        const userData = JSON.parse(user);
        store.dispatch(setUser(userData));
      } catch (e) {
        console.error("Failed to parse user data:", e);
      }
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      // If no token and not on auth route, redirect to auth
      if (!pathname.startsWith("/auth")) {
        router.replace("/auth");
      }
      return;
    }

    const logout = () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("savedEmail");
      document.cookie =
        "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax";

      const isOnAuthRoute = window.location.pathname.startsWith("/auth");

      if (!isOnAuthRoute) {
        router.replace("/auth");
        router.refresh();
      }
    };

    const expiryMs = getTokenExpiryMs(token);

    if (!expiryMs) {
      logout();
      return;
    }

    const remainingMs = expiryMs - Date.now();

    if (remainingMs <= 0) {
      logout();
      return;
    }

    const timerId = window.setTimeout(logout, remainingMs);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [pathname, router]);

  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>
        <Toaster
          position="top-right"
          richColors
          closeButton
          theme="light"
        />
        {children}
      </AuthInitializer>
    </Provider>
  );
}
