"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const ContactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Enter a valid email'),
  subject: z.string().max(150).optional().nullable(),
  message: z.string().min(10, 'Message should be at least 10 characters').max(5000),
})

type ContactFormValues = z.infer<typeof ContactSchema>

export default function ContactPage() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [serverSuccess, setServerSuccess] = useState<string | null>(null)

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
    mode: 'onBlur',
  })

  async function onSubmit(values: ContactFormValues) {
    setServerError(null)
    setServerSuccess(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error ? JSON.stringify(data.error) : 'Failed to send message')
      }

      setServerSuccess('Your message has been sent!')
      form.reset()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setServerError(message)
    }
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold">Contact us</h1>
      <p className="text-muted-foreground mb-6">Have a question or feedback? Send us a message.</p>
      <Separator className="mb-8" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="What is this about?" {...field} />
                </FormControl>
                <FormDescription>Max 150 characters.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea rows={6} placeholder="Write your message..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {serverError && (
            <div className="text-destructive text-sm" role="alert">
              {serverError}
            </div>
          )}
          {serverSuccess && (
            <div className="text-green-600 text-sm" role="status">
              {serverSuccess}
            </div>
          )}

          <div>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Sending...' : 'Send message'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}



