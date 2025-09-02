"use client";

import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";
import { UserProfile } from "@/components/profile/user-profile";
import { LoadingSpinner } from "@/components/common/loading-spinner";

export default function ProfilePage() {
  const { data: session, status } = useAuth();

  if (status === "loading") {
    return (
      <div className="py-8">
        <div className="flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="py-8">
      <UserProfile />
    </div>
  );
}
