import type { Metadata } from "next";

import { ProjectManager } from "@/components/projects/project-manager";
import { requirePageUser } from "@/server/auth/page-guard";
import { listProjects } from "@/server/repositories/project-repository";

export const metadata: Metadata = {
  title: "Projects",
};

export default async function ProjectsPage() {
  const user = await requirePageUser();
  const projects = await listProjects(user.id);

  return (
    <section className="page-section py-14 sm:py-20">
      <div className="mb-10">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-primary">Projects</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-foreground sm:text-5xl">Manage cricket projects</h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
          Create, rename, duplicate, favorite, and delete projects. Every generated image belongs to one project.
        </p>
      </div>
      <ProjectManager initialProjects={projects} />
    </section>
  );
}
