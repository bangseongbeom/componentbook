import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";

export interface AvatarProps extends Omit<ComponentProps<"div">, "children"> {
  /** The URL of the photo. */
  src: string;
  /**
   * The alternative text of the photo.
   *
   * @remarks
   * It's empty by default, because the name is already shown next to the photo.
   */
  alt?: string;
  /** The name of the person. */
  name: ReactNode;
  /** A short text shown below the name. */
  subtitle?: ReactNode;
  /** The size of the photo. */
  size?: "sm" | "md" | "lg" | "xl";
  /** Stacks the photo above the name, and centers them. */
  vertical?: boolean;
  /** The URL that the photo links to. */
  href?: string;
}

/**
 * @example
 * ### Various Orientations
 *
 * #### Horizontal
 *
 * ```tsx
 * <Avatar
 *   src="https://avatars1.githubusercontent.com/u/810438?s=460"
 *   alt="Dan Abramov Profile"
 *   href="https://twitter.com/dan_abramov"
 *   size="lg"
 *   name="Dan Abramov"
 *   subtitle="Working on @reactjs. Co-author of Redux and Create React App."
 * />
 * ```
 *
 * @example
 * #### Vertical
 *
 * ```tsx
 * <Avatar
 *   src="https://avatars1.githubusercontent.com/u/977348?s=460&v=4"
 *   size="xl"
 *   vertical
 *   name="Jordan Walke"
 *   subtitle={
 *     <>
 *       Maker of things: ReactJS. Working on: <a href="https://twitter.com/reasonml">@reasonml</a>.
 *       At: Facebook Engineering.
 *     </>
 *   }
 * />
 * ```
 *
 * @example
 * ### Various Sizes
 *
 * #### Small
 *
 * ```tsx
 * <Avatar
 *   src="https://avatars3.githubusercontent.com/u/13352?s=400&v=4"
 *   size="sm"
 *   name="Christoph Pojer"
 * />
 * ```
 *
 * @example
 * #### Default
 *
 * ```tsx
 * <Avatar
 *   src="https://avatars1.githubusercontent.com/u/165856?s=460&v=4"
 *   name="Hector Ramos"
 *   subtitle="React Native @facebook"
 * />
 * ```
 *
 * @example
 * #### Large
 *
 * ```tsx
 * <Avatar
 *   src="https://avatars2.githubusercontent.com/u/197597?s=460"
 *   size="lg"
 *   name="Christopher Chedeau"
 *   subtitle="Frenchy Front End Engineer"
 * />
 * ```
 *
 * @example
 * #### Extra Large
 *
 * ```tsx
 * <Avatar
 *   src="https://avatars0.githubusercontent.com/u/3757713?s=460&v=4"
 *   size="xl"
 *   name="Joel Marcey"
 *   subtitle="Developer Advocate at Facebook, co-creator of Docusaurus"
 * />
 * ```
 */
export function Avatar({
  src,
  alt = "",
  name,
  subtitle,
  size = "md",
  vertical,
  href,
  className,
  ...props
}: AvatarProps): ReactNode {
  const photoClassName = clsx("avatar__photo", size !== "md" && `avatar__photo--${size}`);

  return (
    <div className={clsx("avatar", vertical && "avatar--vertical", className)} {...props}>
      {href === undefined ? (
        <img className={photoClassName} alt={alt} src={src} />
      ) : (
        <a className={clsx("avatar__photo-link", photoClassName)} href={href}>
          <img alt={alt} src={src} />
        </a>
      )}
      <div className="avatar__intro">
        <div className="avatar__name">{name}</div>
        {subtitle && <small className="avatar__subtitle">{subtitle}</small>}
      </div>
    </div>
  );
}
