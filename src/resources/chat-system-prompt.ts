import { isValidElement, type ReactNode } from "react";
import { about, person } from "./content";

/**
 * Flattens a React node tree from `content.tsx` into plain text so we can
 * reuse the same About / CV copy as a system prompt without keeping two
 * sources of truth. Walks element children manually so this stays safe to
 * import from a Next.js route handler (no `react-dom/server`).
 */
function toText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") {
    return "";
  }
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(toText).join("");
  if (isValidElement(node)) {
    const children = (node.props as { children?: ReactNode })?.children;
    return toText(children);
  }
  return "";
}

function clean(s: string): string {
  return s.replace(/[ \t]+/g, " ").replace(/\s*\n\s*/g, "\n").trim();
}

let cached: string | null = null;

export function getSystemPrompt(): string {
  if (cached) return cached;

  const intro = about.intro.display ? clean(toText(about.intro.description)) : "";

  const experiences = about.work.display
    ? about.work.experiences
        .map((exp) => {
          const bullets = exp.achievements
            .map((a) => `  - ${clean(toText(a))}`)
            .join("\n");
          return `- ${exp.role} @ ${exp.company} (${exp.timeframe})\n${bullets}`;
        })
        .join("\n")
    : "";

  const education = about.studies.display
    ? about.studies.institutions
        .map((s) => `- ${s.name}: ${clean(toText(s.description))}`)
        .join("\n")
    : "";

  const skills = about.technical.display
    ? about.technical.skills
        .map((s) => `- ${s.title}: ${clean(toText(s.description))}`)
        .join("\n")
    : "";

  cached = [
    `You are answering on behalf of ${person.name}, a ${person.role} based in ${person.locationLabel}.`,
    `Speak in the first person ("I", "me", "my"). Be warm, concise, and direct — short paragraphs, no marketing fluff.`,
    `If a question can't be answered from the background below, say so honestly and suggest a more useful question or a link to the work page.`,
    `Never invent employers, dates, projects, or credentials that aren't listed here.`,
    ``,
    `## About me`,
    intro,
    ``,
    `## Experience`,
    experiences,
    ``,
    `## Education`,
    education,
    ``,
    `## Stack I use`,
    skills,
    ``,
    `## Links`,
    `- Portfolio: ${person.name}'s site (this site)`,
    `- Work / projects: /work`,
    `- About: /about`,
  ]
    .filter(Boolean)
    .join("\n")
    .trim();

  return cached;
}
