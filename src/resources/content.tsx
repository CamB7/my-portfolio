import { About, Blog, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";
import { Line, Row, Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "Cameron",
  lastName: "Boyer",
  name: "Cameron Boyer",
  role: "Full stack developer",
  avatar: "/images/avatar.jpg",
  email: "",
  location: "America/St_Johns",
  languages: ["English"],
};

const newsletter: Newsletter = {
  display: false,
  title: <>Newsletter</>,
  description: <>Updates from {person.firstName}</>,
};

const social: Social = [
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/CamB7",
    essential: true,
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/cameron-boyer-934527265/",
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name} — Portfolio`,
  description: `Portfolio and projects by ${person.name}, full stack developer.`,
  headline: (
    <>
      Recent graduate from Keyin College&apos;s full stack software development program
    </>
  ),
  featured: {
    display: false,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">Featured</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          Project
        </Text>
      </Row>
    ),
    href: "/work",
  },
  subline: (
    <>
      I am currently refining my skills in full stack applications and have started learning AI
      workflows to increase productivity. I am currently building real applications weekly!
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `${person.name} — full stack developer; recent Keyin College graduate.`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: false,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        I am currently refining my skills in full stack applications and have started learning AI
        workflows to increase productivity. I am currently building real applications weekly!
      </>
    ),
  },
  work: {
    display: true,
    title: "Experience",
    experiences: [
      {
        company: "Independent practice",
        timeframe: "2025 – Present",
        role: "Full stack developer",
        achievements: [
          <>
            Building and shipping full stack applications on a weekly cadence to deepen experience
            with real-world product workflows.
          </>,
          <>
            Applying modern front-end patterns with React and integrating with back-end and database
            layers.
          </>,
        ],
        images: [
          {
            src: "/images/projects/project-01/cover-01.jpg",
            alt: "Project placeholder",
            width: 16,
            height: 9,
          },
        ],
      },
    ],
  },
  studies: {
    display: true,
    title: "Education",
    institutions: [
      {
        name: "Keyin College",
        description: (
          <>Full stack software development program — recent graduate.</>
        ),
      },
    ],
  },
  technical: {
    display: true,
    title: "Stack",
    skills: [
      {
        title: "React",
        description: (
          <>Building interactive UIs and client-side experiences with React.</>
        ),
        tags: [{ name: "React", icon: "react" }],
        images: [
          {
            src: "/images/projects/project-01/cover-02.jpg",
            alt: "Placeholder project image",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        title: "Java",
        description: (
          <>Server-side logic, APIs, and application structure with Java.</>
        ),
        tags: [{ name: "Java", icon: "java" }],
        images: [
          {
            src: "/images/projects/project-01/cover-03.jpg",
            alt: "Placeholder project image",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        title: "MySQL & PostgreSQL",
        description: (
          <>Relational data modeling, queries, and persistence with MySQL and PostgreSQL.</>
        ),
        tags: [
          { name: "MySQL", icon: "mysql" },
          { name: "PostgreSQL", icon: "postgresql" },
        ],
        images: [
          {
            src: "/images/projects/project-01/cover-04.jpg",
            alt: "Placeholder project image",
            width: 16,
            height: 9,
          },
        ],
      },
    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Writing",
  description: `Notes and posts by ${person.name}`,
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Projects and work samples by ${person.name}`,
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Gallery – ${person.name}`,
  description: `Placeholder images from the template — replace with your own photos when ready.`,
  images: [
    {
      src: "/images/gallery/horizontal-1.jpg",
      alt: "Gallery placeholder",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-4.jpg",
      alt: "Gallery placeholder",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-3.jpg",
      alt: "Gallery placeholder",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "Gallery placeholder",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-2.jpg",
      alt: "Gallery placeholder",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-2.jpg",
      alt: "Gallery placeholder",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-4.jpg",
      alt: "Gallery placeholder",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-3.jpg",
      alt: "Gallery placeholder",
      orientation: "vertical",
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
