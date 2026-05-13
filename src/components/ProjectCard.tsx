import {
  AvatarGroup,
  Carousel,
  Column,
  Flex,
  Heading,
  SmartLink,
  Text,
} from "@once-ui-system/core";
import styles from "./ProjectCard.module.scss";

interface ProjectCardProps {
  href: string;
  priority?: boolean;
  images: string[];
  title: string;
  content: string;
  description: string;
  avatars: { src: string }[];
  link: string;
  backendLink?: string;
  collaborator?: { name: string; url: string };
  /** Used to stagger fade-in delays when multiple cards mount together. */
  animationIndex?: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  href,
  images = [],
  title,
  content,
  description,
  avatars,
  link,
  backendLink,
  collaborator,
  animationIndex = 0,
}) => {
  const primaryLinkLabel = backendLink ? "Frontend" : "View project";
  const hasLinks =
    Boolean(content?.trim()) ||
    Boolean(link) ||
    Boolean(backendLink) ||
    Boolean(collaborator?.url);

  return (
    <Column
      className={styles.root}
      style={{ animationDelay: `${animationIndex * 75}ms` }}
      fillWidth
      gap="l"
      paddingX="s"
      paddingTop="12"
      paddingBottom="24"
      minWidth="0"
      horizontal="center"
    >
      {title && (
        <Heading as="h2" wrap="balance" variant="heading-strong-xl" align="center">
          {title}
        </Heading>
      )}
      {description?.trim() && (
        <Text
          wrap="balance"
          variant="body-default-s"
          onBackground="neutral-weak"
          align="center"
        >
          {description}
        </Text>
      )}
      {images.length > 0 && (
        <Column fillWidth maxWidth={30} horizontal="center">
          <Carousel
            sizes="(max-width: 960px) 60vw, 560px"
            items={images.map((image) => ({
              slide: image,
              alt: title,
            }))}
          />
        </Column>
      )}
      {avatars?.length > 0 && (
        <Flex fillWidth horizontal="center">
          <AvatarGroup avatars={avatars} size="m" reverse />
        </Flex>
      )}
      {hasLinks && (
        <Column gap="8" fillWidth horizontal="center">
          <Flex gap="24" wrap horizontal="center">
            {content?.trim() && (
              <SmartLink
                suffixIcon="arrowRight"
                style={{ margin: "0", width: "fit-content" }}
                href={href}
              >
                <Text variant="body-default-s">Read case study</Text>
              </SmartLink>
            )}
            {link && (
              <SmartLink
                suffixIcon="arrowUpRightFromSquare"
                style={{ margin: "0", width: "fit-content" }}
                href={link}
              >
                <Text variant="body-default-s">{primaryLinkLabel}</Text>
              </SmartLink>
            )}
            {backendLink && (
              <SmartLink
                suffixIcon="arrowUpRightFromSquare"
                style={{ margin: "0", width: "fit-content" }}
                href={backendLink}
              >
                <Text variant="body-default-s">Backend</Text>
              </SmartLink>
            )}
          </Flex>
          {collaborator?.url && (
            <Flex fillWidth horizontal="center">
              <SmartLink
                suffixIcon="arrowUpRightFromSquare"
                style={{ margin: "0", width: "fit-content" }}
                href={collaborator.url}
              >
                <Text variant="body-default-s">Co-contributor: {collaborator.name}</Text>
              </SmartLink>
            </Flex>
          )}
        </Column>
      )}
    </Column>
  );
};
