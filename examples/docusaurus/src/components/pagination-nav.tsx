import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";

export interface PaginationNavLink {
  /** The title of the page. */
  label: ReactNode;
  /** The URL of the page. */
  href: string;
}

export interface PaginationNavProps extends Omit<ComponentProps<"nav">, "children"> {
  /** The link to the previous page, shown on the left. */
  previous?: PaginationNavLink;
  /** The link to the next page, shown on the right. */
  next?: PaginationNavLink;
}

/**
 * @example
 * ### Standard
 *
 * ```tsx
 * <PaginationNav
 *   previous={{ label: "Installation", href: "#url" }}
 *   next={{ label: "Getting Started", href: "#url" }}
 * />
 * ```
 *
 * @example
 * Extremely long titles wrap on to the next line.
 *
 * ```tsx
 * <PaginationNav
 *   previous={{ label: "Some Extremely Long Long Long Long Title", href: "#url" }}
 *   next={{ label: "AnotherExtremelyLongTitleWithoutBreaksProbablyAComponent", href: "#url" }}
 * />
 * ```
 *
 * @example
 * ### Only Previous
 *
 * ```tsx
 * <PaginationNav previous={{ label: "Installation", href: "#url" }} />
 * ```
 *
 * @example
 * ### Only Next
 *
 * ```tsx
 * <PaginationNav
 *   next={{ label: "AnotherExtremelyLongTitleWithoutBreaksProbablyAComponent", href: "#url" }}
 * />
 * ```
 */
export function PaginationNav({
  previous,
  next,
  className,
  ...props
}: PaginationNavProps): ReactNode {
  // The Infima docs wrap each link in a `pagination-nav__item`, which Infima doesn't style anymore.
  // These are the classes that Infima styles, and that Docusaurus uses.
  return (
    <nav aria-label="Pages" className={clsx("pagination-nav", className)} {...props}>
      {previous && (
        <a className="pagination-nav__link pagination-nav__link--prev" href={previous.href}>
          <div className="pagination-nav__sublabel">Previous</div>
          <div className="pagination-nav__label">{previous.label}</div>
        </a>
      )}
      {next && (
        <a className="pagination-nav__link pagination-nav__link--next" href={next.href}>
          <div className="pagination-nav__sublabel">Next</div>
          <div className="pagination-nav__label">{next.label}</div>
        </a>
      )}
    </nav>
  );
}
