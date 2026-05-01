import { UserProfile } from "@/services/userService";
import * as sub from "@/helpers/subscription";

export type Role = "parent" | "coopLeader" | "admin" | "owner";

export const isAdmin = (user: UserProfile | null) => {
  if (!user) return false;
  return ["admin", "owner"].includes(user.role);
};

export const isOwner = (profile: UserProfile | null) => {
  return profile?.role === "owner" || profile?.email === "fitotechnologyllc@gmail.com";
};

export const isVerifiedParent = (profile: UserProfile | null) => {
  if (isOwner(profile) || isAdmin(profile)) return true;
  return profile?.verifiedParent === true;
};

// Feature Gating - Requires Verification + Correct Plan
export const canCreateEvent = (user: UserProfile | null) => {
  if (!isVerifiedParent(user)) return false;
  return sub.canCreateEvent(user);
};

export const canCreateGroup = (user: UserProfile | null) => {
  if (!isVerifiedParent(user)) return false;
  return sub.canCreateGroup(user);
};

export const canUploadMaterials = (user: UserProfile | null) => {
  if (!isVerifiedParent(user)) return false;
  return sub.canUploadMaterials(user);
};

export const canHostVideo = (user: UserProfile | null) => {
  if (!isVerifiedParent(user)) return false;
  return sub.canHostVideo(user);
};

export const canCreateVideoRoom = (user: UserProfile | null) => canHostVideo(user);

export const canUseAI = (user: UserProfile | null) => {
  // AI usage doesn't strictly require KYC payment yet based on prompt, 
  // but it is a Pro feature.
  return sub.canUseAI(user);
};

export const isProUser = (user: UserProfile | null) => sub.isProUser(user);
export const isLeader = (user: UserProfile | null) => sub.isLeader(user);

export const canReviewVerification = (user: UserProfile | null) => {
  return isAdmin(user);
};
