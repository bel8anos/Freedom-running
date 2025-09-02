"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, Calendar, MapPin, Users } from "lucide-react";
import { useRaces, useDeleteRace } from "@/lib/queries";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { Race, RaceFilters } from "@/types";
import { format } from "date-fns";

export default function AdminRacesPage() {
  const { data: session, status } = useAuth();
  const [filters, setFilters] = useState<RaceFilters>({});
  const [searchTerm, setSearchTerm] = useState("");

  const { data: races, isLoading } = useRaces(filters);
  const deleteRaceMutation = useDeleteRace();

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

  const handleDeleteRace = async (raceId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this race? This action cannot be undone."
      )
    ) {
      try {
        await deleteRaceMutation.mutateAsync(raceId);
      } catch (error) {
        console.error("Failed to delete race:", error);
      }
    }
  };

  const filteredRaces =
    races?.filter(
      (race) =>
        race.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        race.location.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div className="py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Races</h1>
          <p className="text-muted-foreground">
            Create, edit, and manage all mountain running races
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/races/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Race
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Races</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              placeholder="Search races..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              value={filters.status || "all"}
              onValueChange={(value) =>
                setFilters({
                  ...filters,
                  status:
                    value === "all" ? undefined : (value as Race["status"]),
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="registration_open">
                  Registration Open
                </SelectItem>
                <SelectItem value="registration_closed">
                  Registration Closed
                </SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Location..."
              value={filters.location || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  location: e.target.value || undefined,
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredRaces.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No races found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRaces.map((race) => (
            <Card
              key={race._id.toString()}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <Badge
                    variant={
                      race.status === "registration_open"
                        ? "default"
                        : race.status === "ongoing"
                        ? "secondary"
                        : race.status === "completed"
                        ? "outline"
                        : "secondary"
                    }
                  >
                    {race.status.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{race.name}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(new Date(race.startDate), "MMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{race.location}</span>
                  </div>
                  {race.maxParticipants && (
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Max {race.maxParticipants} participants</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    asChild
                  >
                    <Link href={`/admin/races/${race._id}/edit`}>
                      <Edit className="mr-2 h-3 w-3" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteRace(race._id.toString())}
                    disabled={deleteRaceMutation.isPending}
                    className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
