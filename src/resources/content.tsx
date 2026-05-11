import { About, Home, Newsletter, Person, Social, Work } from "@/types";
import { Line, Row, Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "Cameron",
  lastName: "Boyer",
  name: "Cameron Boyer",
  role: "Full stack developer",
  avatar: "/images/Headshot.png",
  email: "",
  location: "America/St_Johns",
  locationLabel: "St. John's, Newfoundland",
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
      Full stack developer, building weekly.
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
      Recent Keyin College graduate based in St. John&apos;s, Newfoundland. I ship a new full
      stack project every week and lean on AI-assisted workflows to build faster and learn
      sharper.
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
        I&apos;m a full stack developer based in St. John&apos;s, Newfoundland — a recent
        Keyin College graduate shipping a new project every week. Lately I&apos;ve been
        leaning into AI-assisted workflows to learn faster, design with intention, and ship
        with confidence.
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
      },
      {
        title: "Java",
        description: (
          <>Server-side logic, APIs, and application structure with Java.</>
        ),
        tags: [{ name: "Java", icon: "java" }],
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
      },
    ],
  },
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Projects and work samples by ${person.name}`,
};

export { person, social, newsletter, home, about, work };
