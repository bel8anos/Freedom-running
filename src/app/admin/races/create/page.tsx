"use client";

import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";
import { RaceForm } from "@/components/admin/race-form";
import { LoadingSpinner } from "@/components/common/loading-spinner";

export default function CreateRacePage() {
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

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Create New Race</h1>
          <p className="text-muted-foreground">
            Set up a new mountain running tournament
          </p>
        </div>
        <RaceForm />
      </div>
    </div>
  );
}
