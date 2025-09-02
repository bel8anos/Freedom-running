"use client";

import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { LoadingSpinner } from "@/components/common/loading-spinner";

export default function AdminPage() {
  const { data: session, status } = useAuth();

  console.log(session);
  console.log(status);

  if (status === "loading") {
    return (
      <div className="py-8">
        <div className="flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="py-8">
      <AdminDashboard />
    </div>
  );
}
