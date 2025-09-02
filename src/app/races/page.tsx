"use client";

import { useState } from "react";
import { RaceCard } from "@/components/race/race-card";
import { RaceFilters } from "@/components/race/race-filters";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { useRaces } from "@/lib/queries";
import { RaceFilters as RaceFiltersType } from "@/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function RacesPage() {
  const [filters, setFilters] = useState<RaceFiltersType>({});
  const { data: races, isLoading, error } = useRaces(filters);
  const { data: session } = useAuth();

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Error Loading Races
          </h1>
          <p className="text-muted-foreground">
            Unable to load races. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Mountain Running Races
          </h1>
          <p className="text-muted-foreground">
            Discover and register for exciting mountain running tournaments
            across Greece
          </p>
        </div>
        {session?.user?.role === "admin" && (
          <Button asChild>
            <Link href="/admin/races/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Race
            </Link>
          </Button>
        )}
      </div>

      <div className="mb-6">
        <RaceFilters filters={filters} onFiltersChange={setFilters} />
      </div>

      {races?.length === 0 ? (
        <div className="py-12 text-center">
          <h3 className="text-lg font-semibold">No races found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or check back later for new races.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {races?.map((race) => (
            <RaceCard key={race._id.toString()} race={race} />
          ))}
        </div>
      )}
    </div>
  );
}
