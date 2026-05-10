import { Outlet } from "react-router";
import { Toaster } from "sonner";
import { AuthProvider } from "../context/AuthContext";

export function Root() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <main>
          <Outlet />
        </main>
        <Toaster richColors position="top-right" />
      </div>
    </AuthProvider>
  );
}