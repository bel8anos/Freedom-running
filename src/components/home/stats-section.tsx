'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Mountain, Users, Calendar, Trophy } from 'lucide-react'

const stats = [
  {
    icon: Calendar,
    value: '50+',
    label: 'Races Organized',
    description: 'Professional mountain running events across Greece'
  },
  {
    icon: Users,
    value: '2,500+',
    label: 'Active Runners',
    description: 'Passionate athletes in our community'
  },
  {
    icon: Mountain,
    value: '25+',
    label: 'Trail Locations',
    description: 'Stunning mountain venues nationwide'
  },
  {
    icon: Trophy,
    value: '98%',
    label: 'Satisfaction Rate',
    description: 'Runners who would recommend us'
  }
]

export function StatsSection() {
  return (
    <section className="bg-muted/50 py-16 lg:py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Trusted by Runners Across Greece
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of runners who have made Freedom Running their platform of choice
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="mb-2 text-3xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="mb-2 font-semibold text-foreground">
                    {stat.label}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}