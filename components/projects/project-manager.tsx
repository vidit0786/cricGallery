"use client";

import Link from "next/link";
import { useState } from "react";
import { Copy, FolderPlus, Heart, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProjectItem {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  _count: { generatedImages: number };
}

export function ProjectManager({ initialProjects }: { initialProjects: ProjectItem[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [name, setName] = useState("");

  const createProject = async () => {
    if (!name.trim()) return;
    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    if (!response.ok) return;
    const project = (await response.json()) as ProjectItem;
    setProjects((current) => [{ ...project, _count: { generatedImages: 0 } }, ...current]);
    setName("");
  };

  const renameProject = async (project: ProjectItem) => {
    const nextName = window.prompt("Rename project", project.name);
    if (!nextName?.trim()) return;
    const response = await fetch(`/api/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nextName.trim() }),
    });
    if (!response.ok) return;
    setProjects((current) => current.map((item) => (item.id === project.id ? { ...item, name: nextName.trim() } : item)));
  };

  const toggleFavorite = async (project: ProjectItem) => {
    const response = await fetch(`/api/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFavorite: !project.isFavorite }),
    });
    if (!response.ok) return;
    setProjects((current) => current.map((item) => (item.id === project.id ? { ...item, isFavorite: !item.isFavorite } : item)));
  };

  const duplicateProject = async (project: ProjectItem) => {
    const response = await fetch(`/api/projects/${project.id}/duplicate`, { method: "POST" });
    if (!response.ok) return;
    const copy = (await response.json()) as ProjectItem;
    setProjects((current) => [{ ...copy, _count: { generatedImages: project._count.generatedImages } }, ...current]);
  };

  const deleteProject = async (project: ProjectItem) => {
    if (!window.confirm(`Delete project "${project.name}" and its images?`)) return;
    const response = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
    if (!response.ok) return;
    setProjects((current) => current.filter((item) => item.id !== project.id));
  };

  return (
    <div className="grid gap-5">
      <Card>
        <CardContent className="flex flex-col gap-3 p-5 sm:flex-row">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="New project name"
            className="h-12 flex-1 rounded-2xl border border-input bg-white/[0.04] px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/25"
          />
          <Button type="button" onClick={createProject} disabled={!name.trim()}>
            <FolderPlus aria-hidden="true" /> Create Project
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <Link href={`/projects/${project.id}`} className="min-w-0">
                  <h2 className="truncate text-xl font-black text-foreground">{project.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{project._count.generatedImages} generated images</p>
                </Link>
                <button type="button" onClick={() => toggleFavorite(project)} className="text-primary" aria-label="Toggle favorite project">
                  <Heart className={project.isFavorite ? "fill-primary" : undefined} aria-hidden="true" />
                </button>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => renameProject(project)}>
                  <Pencil aria-hidden="true" /> Rename
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => duplicateProject(project)}>
                  <Copy aria-hidden="true" /> Duplicate
                </Button>
                <Button type="button" variant="destructive" size="sm" onClick={() => deleteProject(project)}>
                  <Trash2 aria-hidden="true" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
