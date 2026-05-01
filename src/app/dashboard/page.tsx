import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { AuthAppShell } from "@/components/layout/AuthAppShell";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <AuthAppShell>
        <DashboardContent />
      </AuthAppShell>
    </ProtectedRoute>
  );
}
