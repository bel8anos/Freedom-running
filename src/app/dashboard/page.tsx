"use client";

import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";
import { UserDashboard } from "@/components/dashboard/user-dashboard";
import { LoadingSpinner } from "@/components/common/loading-spinner";

export default function DashboardPage() {
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
      <UserDashboard />
    </div>
  );
}
