import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ProfileContent from "@/components/profile/ProfileContent";
import { AuthAppShell } from "@/components/layout/AuthAppShell";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <AuthAppShell>
        <ProfileContent />
      </AuthAppShell>
    </ProtectedRoute>
  );
}
