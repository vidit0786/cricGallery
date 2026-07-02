import Image from "next/image";
import type { Metadata } from "next";

import { Card, CardContent } from "@/components/ui/card";
import { IPL_TEAMS, INTERNATIONAL_TEAMS, PLAYER_ROLES, STADIUMS } from "@/lib/cricket-options";
import { requirePageUser } from "@/server/auth/page-guard";
import { listGeneratedImages } from "@/server/repositories/generated-image-repository";
import { listProjects } from "@/server/repositories/project-repository";

export const metadata: Metadata = {
  title: "History",
};

interface HistoryPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function value(params: Record<string, string | string[] | undefined>, key: string) {
  const raw = params[key];
  return Array.isArray(raw) ? raw[0] : raw;
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const user = await requirePageUser();
  const params = await searchParams;
  const projects = await listProjects(user.id);
  const images = await listGeneratedImages(user.id, {
    team: value(params, "team"),
    role: value(params, "role"),
    stadium: value(params, "stadium"),
    promptVersion: value(params, "promptVersion"),
    projectId: value(params, "projectId"),
    favorite: value(params, "favorite") === "true" ? true : undefined,
    dateFrom: value(params, "dateFrom") ? new Date(value(params, "dateFrom")!) : undefined,
    dateTo: value(params, "dateTo") ? new Date(value(params, "dateTo")!) : undefined,
  });
  const teamOptions = [...IPL_TEAMS, ...INTERNATIONAL_TEAMS];

  return (
    <section className="page-section py-14 sm:py-20">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-primary">History</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-foreground sm:text-5xl">Generation history</h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
          Search and filter generated images by team, role, stadium, date, prompt version, favorite status, and project.
        </p>
      </div>

      <Card className="mt-8">
        <CardContent className="p-5">
          <form className="grid gap-3 md:grid-cols-4" action="/history">
            <select name="team" defaultValue={value(params, "team") ?? ""} className="h-11 rounded-2xl border border-input bg-white/[0.04] px-3 text-sm text-foreground">
              <option value="" className="bg-card">All teams</option>
              {teamOptions.map((team) => <option key={team} value={team} className="bg-card">{team}</option>)}
            </select>
            <select name="role" defaultValue={value(params, "role") ?? ""} className="h-11 rounded-2xl border border-input bg-white/[0.04] px-3 text-sm text-foreground">
              <option value="" className="bg-card">All roles</option>
              {PLAYER_ROLES.map((role) => <option key={role} value={role} className="bg-card">{role}</option>)}
            </select>
            <select name="stadium" defaultValue={value(params, "stadium") ?? ""} className="h-11 rounded-2xl border border-input bg-white/[0.04] px-3 text-sm text-foreground">
              <option value="" className="bg-card">All stadiums</option>
              {STADIUMS.map((stadium) => <option key={stadium} value={stadium} className="bg-card">{stadium}</option>)}
            </select>
            <select name="projectId" defaultValue={value(params, "projectId") ?? ""} className="h-11 rounded-2xl border border-input bg-white/[0.04] px-3 text-sm text-foreground">
              <option value="" className="bg-card">All projects</option>
              {projects.map((project) => <option key={project.id} value={project.id} className="bg-card">{project.name}</option>)}
            </select>
            <input name="promptVersion" placeholder="Prompt version" defaultValue={value(params, "promptVersion") ?? ""} className="h-11 rounded-2xl border border-input bg-white/[0.04] px-3 text-sm text-foreground placeholder:text-muted-foreground" />
            <input name="dateFrom" type="date" defaultValue={value(params, "dateFrom") ?? ""} className="h-11 rounded-2xl border border-input bg-white/[0.04] px-3 text-sm text-foreground" />
            <input name="dateTo" type="date" defaultValue={value(params, "dateTo") ?? ""} className="h-11 rounded-2xl border border-input bg-white/[0.04] px-3 text-sm text-foreground" />
            <label className="flex h-11 items-center gap-2 rounded-2xl border border-input bg-white/[0.04] px-3 text-sm text-foreground">
              <input name="favorite" value="true" type="checkbox" defaultChecked={value(params, "favorite") === "true"} /> Favorite
            </label>
            <button className="h-11 rounded-2xl bg-primary px-4 text-sm font-bold text-primary-foreground md:col-span-4" type="submit">
              Apply filters
            </button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image) => (
          <Card key={image.id}>
            <CardContent className="p-4">
              <div className="relative aspect-square overflow-hidden rounded-3xl bg-black/25">
                <Image src={image.generatedImageDataUrl} alt={image.name} fill sizes="360px" className="object-cover" unoptimized />
              </div>
              <h2 className="mt-3 truncate font-black text-foreground">{image.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{image.project.name} · Prompt {image.promptVersion}</p>
            </CardContent>
          </Card>
        ))}
        {!images.length ? <p className="text-sm text-muted-foreground">No images match the selected filters.</p> : null}
      </div>
    </section>
  );
}
