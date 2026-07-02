"use client";

import { FormEvent, useState } from "react";
import { MailCheck, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Frontend-only contact form. It validates basic browser constraints and shows
 * a local success state without sending data to a server.
 */
export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send a message</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-semibold text-foreground">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Your name"
              className="h-12 rounded-2xl border border-input bg-white/[0.04] px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/25"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-semibold text-foreground">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="h-12 rounded-2xl border border-input bg-white/[0.04] px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/25"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="message" className="text-sm font-semibold text-foreground">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              placeholder="Tell us what you would like to see in Cricket AI Studio."
              className="resize-none rounded-2xl border border-input bg-white/[0.04] px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/25"
            />
          </div>

          <Button type="submit" size="lg" className="w-full sm:w-fit">
            Send message
            <Send aria-hidden="true" />
          </Button>

          {submitted ? (
            <p className="flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 p-3 text-sm text-foreground">
              <MailCheck className="size-4 text-primary" aria-hidden="true" /> Message captured locally. No backend is connected in Phase 1.
            </p>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
