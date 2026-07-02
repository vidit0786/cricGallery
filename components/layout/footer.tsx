import Link from "next/link";
import { BadgeCheck, GitBranch, Mail, Trophy } from "lucide-react";

const footerLinks = [
  { href: "/upload", label: "Upload" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/** Footer used by every route in the root layout. */
export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-black/20">
      <div className="page-section grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl border border-primary/30 bg-primary/15 text-primary">
              <Trophy className="size-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-black tracking-tight">Cricket AI Studio</span>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
            A polished frontend foundation for future AI-powered cricket portrait generation.
            Phase 1 intentionally avoids AI, authentication, databases, and external APIs.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-primary/80">Explore</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link className="transition-colors hover:text-foreground" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-primary/80">Status</h2>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <BadgeCheck className="size-4 text-primary" aria-hidden="true" /> Frontend only
            </p>
            <p className="flex items-center gap-2">
              <Mail className="size-4 text-primary" aria-hidden="true" /> No backend connected
            </p>
            <p className="flex items-center gap-2">
              <GitBranch className="size-4 text-primary" aria-hidden="true" /> Ready for Phase 2
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <p className="page-section text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Cricket AI Studio. Built as a production-ready frontend foundation.
        </p>
      </div>
    </footer>
  );
}
