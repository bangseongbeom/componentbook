import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";

export interface HeroProps extends Omit<ComponentProps<"div">, "title"> {
  /** The headline. */
  title: ReactNode;
  /** A short text shown below the headline. */
  subtitle?: ReactNode;
  /** The content below the subtitle, like a call-to-action button. */
  children?: ReactNode;
  /** The background color. By default, it's the color of the page's surface. */
  variant?: "primary" | "dark";
}

/**
 * @example
 * ### Default
 *
 * ```tsx
 * <Hero className="shadow--lw" title="Hero Title" subtitle="Not all heroes wear capes">
 *   <button className="button button--secondary button--outline button--lg">Get Started</button>
 * </Hero>
 * ```
 *
 * @example
 * ### Dark
 *
 * ```tsx
 * <Hero variant="dark" title="Hero Title" subtitle="Not all heroes wear capes">
 *   <button className="button button--primary button--outline button--lg">Get Started</button>
 * </Hero>
 * ```
 *
 * @example
 * ### Primary
 *
 * Contents are vertically-centered.
 *
 * ```tsx
 * <Hero
 *   variant="primary"
 *   style={{ height: "25rem" }}
 *   title="Hero Title"
 *   subtitle="Not all heroes wear capes"
 * >
 *   <button className="button button--secondary button--lg">Get Started</button>
 * </Hero>
 * ```
 */
export function Hero({
  title,
  subtitle,
  children,
  variant,
  className,
  ...props
}: HeroProps): ReactNode {
  return (
    <div className={clsx("hero", variant && `hero--${variant}`, className)} {...props}>
      <div className="container">
        <h1 className="hero__title">{title}</h1>
        {subtitle && <p className="hero__subtitle">{subtitle}</p>}
        {children && <div>{children}</div>}
      </div>
    </div>
  );
}
