import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { cache } from "react";

type Team = {
  name: string;
  role: string;
  avatar: string;
  linkedIn: string;
};

type Collaborator = {
  name: string;
  url: string;
};

type Metadata = {
  title: string;
  subtitle?: string;
  publishedAt: string;
  summary: string;
  image?: string;
  images: string[];
  tag?: string;
  team: Team[];
  link?: string;
  /** Optional companion backend repo. When set, the primary `link` is labeled “Frontend”. */
  backendLink?: string;
  /** Shown on project cards as a link below “View project” (e.g. teammate GitHub). */
  collaborator?: Collaborator;
};

import { notFound } from "next/navigation";

function getMDXFiles(dir: string) {
  if (!fs.existsSync(dir)) {
    notFound();
  }

  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(rawContent);

  const metadata: Metadata = {
    title: data.title || "",
    subtitle: data.subtitle || "",
    publishedAt: data.publishedAt,
    summary: data.summary || "",
    image: data.image || "",
    images: data.images || [],
    tag: data.tag || [],
    team: data.team || [],
    link: data.link || "",
    backendLink: data.backendLink || undefined,
    collaborator:
      data.collaborator?.name && data.collaborator?.url
        ? { name: data.collaborator.name, url: data.collaborator.url }
        : undefined,
  };

  return { metadata, content };
}

function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file));
    const slug = path.basename(file, path.extname(file));

    return {
      metadata,
      slug,
      content,
    };
  });
}

/** Dedupe MDX reads within the same request (multiple `getPosts` calls per page). */
const loadPostsForDir = cache((absoluteDir: string) => getMDXData(absoluteDir));

export function getPosts(customPath = ["", "", "", ""]) {
  const postsDir = path.join(process.cwd(), ...customPath);
  return loadPostsForDir(postsDir);
}
