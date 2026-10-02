import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { galleryProjects, getNextProject, getProject } from "../../../data/gallery";
import BackPill from "../../../components/work/BackPill";
import DetailHero from "../../../components/work/DetailHero";
import HorizontalGallery from "../../../components/work/HorizontalGallery";
import ProjectFooter from "../../../components/work/ProjectFooter";
import SiteHeader from "../../../components/work/SiteHeader";

interface DetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return galleryProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found — Studio AVA" };

  return {
    title: `${project.title} — Studio AVA`,
    description: project.summary,
  };
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const next = getNextProject(project.slug);

  return (
    <article
      style={{
        background: project.theme.bg,
        color: project.theme.fg,
        ["--w-fg-muted" as string]: project.theme.muted,
      }}
    >
      <SiteHeader accent={project.theme.accent} />
      <BackPill />

      <main>
        <DetailHero project={project} />
        <HorizontalGallery project={project} />
        <ProjectFooter next={next} accent={project.theme.accent} />
      </main>
    </article>
  );
}