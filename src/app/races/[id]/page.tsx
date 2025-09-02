"use client";

import { useParams } from "next/navigation";
import { RaceDetails } from "@/components/race/race-details";
import { RegistrationSection } from "@/components/race/registration-section";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { useRace } from "@/lib/queries";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function RaceDetailPage() {
  const params = useParams();
  const raceId = params.id as string;

  const { data: race, isLoading, error } = useRace(raceId);

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !race) {
    return (
      <div className="py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error ? "Failed to load race details" : "Race not found"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RaceDetails race={race} />
        </div>
        <div>
          <RegistrationSection race={race} />
        </div>
      </div>
    </div>
  );
}
