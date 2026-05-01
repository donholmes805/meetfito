import { UserProfile } from "@/services/userService";

export const isProUser = (profile: UserProfile | null) => {
  if (!profile) return false;
  if (profile.role === "owner" || profile.role === "admin") return true;
  return profile.plan === "pro" || profile.plan === "leader";
};

export const isLeader = (profile: UserProfile | null) => {
  if (!profile) return false;
  if (profile.role === "owner" || profile.role === "admin") return true;
  return profile.plan === "leader";
};

export const isOwner = (profile: UserProfile | null) => {
  return profile?.role === "owner" || false;
};

export const canCreateEvent = (profile: UserProfile | null) => {
  if (!profile) return false;
  if (isOwner(profile) || profile.role === "admin") return true;
  // Free users can join but not create? Or maybe limit free users to 1-2 events.
  // The user prompt says: "FREE: Limited events", "PRO: Create events"
  return isProUser(profile);
};

export const canCreateGroup = (profile: UserProfile | null) => {
  if (!profile) return false;
  if (isOwner(profile) || profile.role === "admin") return true;
  return isProUser(profile);
};

export const canUseAI = (profile: UserProfile | null) => {
  if (!profile) return false;
  if (isOwner(profile) || profile.role === "admin") return true;
  
  const limits = {
    free: 5,
    pro: 50,
    leader: 200
  };
  
  const limit = limits[profile.plan] || limits.free;
  return profile.aiUsageToday < limit;
};

export const canHostVideo = (profile: UserProfile | null) => {
  if (!profile) return false;
  if (isOwner(profile) || profile.role === "admin") return true;
  return isProUser(profile);
};

export const canUploadMaterials = (profile: UserProfile | null) => {
  if (!profile) return false;
  if (isOwner(profile) || profile.role === "admin") return true;
  return isProUser(profile);
};
