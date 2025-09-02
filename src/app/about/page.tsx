import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Mountain, Users, Trophy } from "lucide-react"


export default function AboutPage() {
	return (
		<section className="relative overflow-hidden">
			<div className="relative z-20 mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
				<h1 className="mb-4 text-3xl font-bold tracking-tight text-white">About</h1>
				<p className="text-lg leading-relaxed text-white/85">
					Mountain running is pure freedom—an escape from roads, routines, and rules. It’s just you, the trail, and the wild. No crowds, no pace pressure, only the raw challenge of the climb and the thrill of the descent. Every step connects you to the earth, every summit rewards you with open skies. Here, the only limits are the ones you push past. Run hard, breathe deep, and let the mountains remind you what it means to be truly alive.
				</p>

				<div className="my-10">
					<Separator />
				</div>

				<div className="grid gap-8 sm:grid-cols-3">
					<div className="text-center">
						<div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
							<Mountain className="h-6 w-6 text-white" />
						</div>
						<h3 className="mb-1 text-base font-semibold text-white">Wild Terrain</h3>
						<p className="text-sm text-white/75">Technical paths, alpine meadows, and ridgeline traverses.</p>
					</div>
					<div className="text-center">
						<div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
							<Users className="h-6 w-6 text-white" />
						</div>
						<h3 className="mb-1 text-base font-semibold text-white">Quiet Miles</h3>
						<p className="text-sm text-white/75">Fewer crowds, more headspace—run your own line.</p>
					</div>
					<div className="text-center">
						<div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
							<Trophy className="h-6 w-6 text-white" />
						</div>
						<h3 className="mb-1 text-base font-semibold text-white">Earned Summits</h3>
						<p className="text-sm text-white/75">Not about medals—about moments above the clouds.</p>
					</div>
				</div>

				<div className="mt-10 flex justify-center">
					<Button size="lg" asChild>
						<Link href="/races">Explore Races</Link>
					</Button>
				</div>
			</div>

			<Image
				src="/Olympus_National_Park_30.jpg"
				alt="Mountain landscape"
				fill
				priority
				sizes="100vw"
				quality={90}
				className="absolute inset-0 z-0 object-cover contrast-110 saturate-110"
			/>

			<div className="pointer-events-none absolute inset-0 z-10 bg-black/35" />
		</section>
	)
}



