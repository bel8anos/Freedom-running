import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mountain, Users, Trophy } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="relative z-20 mx-auto max-w-4xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="flex items-center space-x-2 rounded-full bg-white/10 px-4 py-2 text-white">
              <Mountain className="h-5 w-5" />
              <span className="text-sm font-medium">
                Greece's Premier Mountain Running Platform
              </span>
            </div>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Freedom Running
            <span className="block text-white">Conquer the Mountains</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/80 sm:text-xl">
            Experience the ultimate mountain running adventure in Greece.
            Discover breathtaking trails, challenge your limits, and join a
            community of passionate trail runners across the Greek mountains.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="group" asChild>
              <Link href="/races">
                Explore Races
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white/40 bg-transparent hover:bg-white/10 backdrop-blur-sm" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                <Mountain className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">Epic Trails</h3>
              <p className="text-center text-sm text-white/70">
                Discover stunning mountain trails across Greece's most beautiful
                landscapes
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">Vibrant Community</h3>
              <p className="text-center text-sm text-white/70">
                Join thousands of passionate runners and build lasting
                connections
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                Professional Events
              </h3>
              <p className="text-center text-sm text-white/70">
                Compete in professionally organized tournaments with timing and
                rankings
              </p>
            </div>
          </div>
        </div>
      </div>

      <Image
        src="/drakolimni-tymfi-scaled.jpg"
        alt="Mount Olympus"
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 z-0 object-cover contrast-110 saturate-110"
      />

      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>
    </section>
  );
}
