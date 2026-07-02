import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Folder, Heart, ImageIcon, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requirePageUser } from "@/server/auth/page-guard";
import { getGenerationCount, getRecentImages } from "@/server/repositories/generated-image-repository";
import { listProjects } from "@/server/repositories/project-repository";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const user = await requirePageUser();
  const [projects, recentImages, generationCount] = await Promise.all([
    listProjects(user.id),
    getRecentImages(user.id, 6),
    getGenerationCount(user.id),
  ]);

  const favoriteProjects = projects.filter((project) => project.isFavorite);

  return (
    <section className="page-section py-14 sm:py-20">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-primary">Dashboard</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            Welcome back{user.name ? `, ${user.name}` : ""}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
            Manage projects, review generation history, and quickly create new cricket images.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/upload">
            <Sparkles aria-hidden="true" /> Quick Generate
          </Link>
        </Button>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <Folder className="size-10 text-primary" aria-hidden="true" />
            <div>
              <p className="text-3xl font-black text-foreground">{projects.length}</p>
              <p className="text-sm text-muted-foreground">Projects</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <ImageIcon className="size-10 text-primary" aria-hidden="true" />
            <div>
              <p className="text-3xl font-black text-foreground">{generationCount}</p>
              <p className="text-sm text-muted-foreground">Generated images</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <Heart className="size-10 text-primary" aria-hidden="true" />
            <div>
              <p className="text-3xl font-black text-foreground">{favoriteProjects.length}</p>
              <p className="text-sm text-muted-foreground">Favorite projects</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {projects.slice(0, 6).map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4 transition-colors hover:border-primary/30"
              >
                <div>
                  <p className="font-bold text-foreground">{project.name}</p>
                  <p className="text-sm text-muted-foreground">{project._count.generatedImages} images</p>
                </div>
                {project.isFavorite ? <Heart className="size-5 fill-primary text-primary" aria-hidden="true" /> : null}
              </Link>
            ))}
            {!projects.length ? <p className="text-sm text-muted-foreground">No projects yet.</p> : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Images</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {recentImages.map((image) => (
              <Link key={image.id} href={`/projects/${image.projectId}`} className="group block">
                <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/10 bg-black/20">
                  <Image src={image.generatedImageDataUrl} alt={image.name} fill sizes="160px" className="object-cover transition-transform group-hover:scale-105" unoptimized />
                </div>
                <p className="mt-2 truncate text-sm font-semibold text-foreground">{image.name}</p>
              </Link>
            ))}
            {!recentImages.length ? <p className="col-span-full text-sm text-muted-foreground">No generated images yet.</p> : null}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
