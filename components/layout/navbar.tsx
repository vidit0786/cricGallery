"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Sparkles, Trophy, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/upload", label: "Upload" },
  { href: "/gallery", label: "Gallery" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projects", label: "Projects" },
  { href: "/history", label: "History" },
  { href: "/settings", label: "Settings" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/**
 * Global navigation for the App Router shell.
 * It is a client component only because it tracks the mobile menu state
 * and reads the active pathname for accessible navigation feedback.
 */
export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/72 backdrop-blur-2xl">
      <nav className="page-section flex h-20 items-center justify-between" aria-label="Main navigation">
        <Link href="/" className="group flex items-center gap-3" onClick={() => setIsOpen(false)}>
          <span className="relative grid size-11 place-items-center rounded-2xl border border-primary/30 bg-primary/15 text-primary shadow-[0_0_32px_rgba(183,249,90,0.18)] transition-transform group-hover:rotate-3">
            <Trophy className="size-5" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-base font-black tracking-tight text-foreground">Cricket AI Studio</span>
            <span className="mt-1 text-xs font-medium uppercase tracking-[0.28em] text-primary/80">
              Phase 1
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 lg:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/[0.08] hover:text-foreground",
                  isActive && "bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Button variant="outline" asChild>
            <Link href="/gallery">View Gallery</Link>
          </Button>
          <Button asChild>
            <Link href="/upload">
              Start Uploading
              <Sparkles aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </Button>
      </nav>

      {isOpen ? (
        <div className="border-t border-white/10 bg-background/95 px-4 py-4 shadow-2xl backdrop-blur-2xl lg:hidden">
          <div className="mx-auto flex max-w-xl flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-white/[0.08] hover:text-foreground",
                    isActive && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </header>
  );
}
