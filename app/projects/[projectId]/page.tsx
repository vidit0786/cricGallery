import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";

import { ImageManager } from "@/components/projects/image-manager";
import { Button } from "@/components/ui/button";
import { requirePageUser } from "@/server/auth/page-guard";
import { getProjectById, listProjects } from "@/server/repositories/project-repository";

export const metadata: Metadata = {
  title: "Project",
};

interface ProjectPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const user = await requirePageUser();
  const { projectId } = await params;
  const [project, projects] = await Promise.all([getProjectById(user.id, projectId), listProjects(user.id)]);

  if (!project) notFound();

  return (
    <section className="page-section py-14 sm:py-20">
      <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/projects">
              <ArrowLeft aria-hidden="true" /> Back to Projects
            </Link>
          </Button>
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-primary">Project</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-foreground sm:text-5xl">{project.name}</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
            {project._count.generatedImages} generated images saved in this project.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/upload">
            <Sparkles aria-hidden="true" /> Generate Image
          </Link>
        </Button>
      </div>

      <ImageManager initialImages={project.generatedImages} projects={projects.map((item) => ({ id: item.id, name: item.name }))} />
    </section>
  );
}
