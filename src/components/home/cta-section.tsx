import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mountain } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-primary py-16 lg:py-24">
      <div className="relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
              <Mountain className="h-8 w-8 text-white" />
            </div>
          </div>

          <h2 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Ready to Start Your Mountain Running Journey?
          </h2>

          <p className="mb-8 text-lg text-blue-100 sm:text-xl">
            Join our community of passionate trail runners and discover the most
            beautiful mountain trails Greece has to offer. Your next adventure
            awaits!
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="group bg-white text-primary hover:bg-white/90"
              asChild
            >
              <Link href="/races">
                Browse Races
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 bg-transparent text-white hover:bg-white/10"
              asChild
            >
              <Link href="/auth/signin">Sign Up Today</Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-blue-100">
            Free to join • Professional timing • Beautiful locations
          </p>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
    </section>
  );
}
