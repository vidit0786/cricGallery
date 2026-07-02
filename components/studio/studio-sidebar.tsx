import Link from "next/link";
import { Folder, Heart, History, LayoutDashboard, Settings, Sparkles, Trophy } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/upload", label: "Studio", icon: Sparkles },
  { href: "/projects", label: "Projects", icon: Folder },
  { href: "/history?favorite=true", label: "Favorites", icon: Heart },
  { href: "/history", label: "History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface StudioSidebarProps {
  projects?: Array<{ id: string; name: string }>;
}

/** Left studio navigation inspired by premium creative AI tools. */
export function StudioSidebar({ projects = [] }: StudioSidebarProps) {
  return (
    <aside className="sticky top-24 hidden h-[calc(100vh-7rem)] w-72 shrink-0 overflow-hidden rounded-[2rem] border border-white/10 bg-[#07130e]/85 p-4 shadow-2xl shadow-black/30 backdrop-blur-2xl xl:block">
      <div className="flex h-full flex-col">
        <div className="mb-5 flex items-center gap-3 rounded-3xl border border-primary/20 bg-primary/10 p-3">
          <div className="grid size-10 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <Trophy className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-black text-foreground">Cricket Studio</p>
            <p className="text-xs text-muted-foreground">Professional workspace</p>
          </div>
        </div>

        <nav className="grid gap-1" aria-label="Studio navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-muted-foreground transition-all duration-200 hover:bg-white/[0.06] hover:text-foreground"
            >
              <item.icon className="size-4 text-primary/80 transition-transform group-hover:scale-110" aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 min-h-0 flex-1 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-3">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-primary">Projects</p>
          <div className="grid max-h-full gap-1 overflow-auto pr-1">
            {projects.slice(0, 8).map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="truncate rounded-2xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
              >
                {project.name}
              </Link>
            ))}
            {!projects.length ? <p className="px-3 py-2 text-sm text-muted-foreground">No projects yet.</p> : null}
          </div>
        </div>
      </div>
    </aside>
  );
}
