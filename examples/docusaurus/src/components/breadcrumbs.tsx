import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";

export interface BreadcrumbsProps extends ComponentProps<"nav"> {
  /** The items, as `<BreadcrumbsItem>` elements. */
  children: ReactNode;
  /** The size. */
  size?: "sm" | "md" | "lg";
}

/**
 * @example
 * ### Sizes
 *
 * #### Normal
 *
 * ```tsx
 * <Breadcrumbs>
 *   <BreadcrumbsItem href="#url">Infima</BreadcrumbsItem>
 *   <BreadcrumbsItem href="#url">Docs</BreadcrumbsItem>
 *   <BreadcrumbsItem href="#url">Component</BreadcrumbsItem>
 *   <BreadcrumbsItem href="#url" active>Breadcrumb</BreadcrumbsItem>
 * </Breadcrumbs>
 * ```
 *
 * @example
 * #### Small
 *
 * ```tsx
 * <Breadcrumbs size="sm">
 *   <BreadcrumbsItem href="#url">Infima</BreadcrumbsItem>
 *   <BreadcrumbsItem href="#url">Docs</BreadcrumbsItem>
 *   <BreadcrumbsItem href="#url">Component</BreadcrumbsItem>
 *   <BreadcrumbsItem href="#url" active>Breadcrumb</BreadcrumbsItem>
 * </Breadcrumbs>
 * ```
 *
 * @example
 * #### Large
 *
 * ```tsx
 * <Breadcrumbs size="lg">
 *   <BreadcrumbsItem href="#url">Infima</BreadcrumbsItem>
 *   <BreadcrumbsItem href="#url">Docs</BreadcrumbsItem>
 *   <BreadcrumbsItem href="#url">Component</BreadcrumbsItem>
 *   <BreadcrumbsItem href="#url" active>Breadcrumb</BreadcrumbsItem>
 * </Breadcrumbs>
 * ```
 */
export function Breadcrumbs({
  children,
  size = "md",
  className,
  ...props
}: BreadcrumbsProps): ReactNode {
  return (
    <nav aria-label="breadcrumbs" className={className} {...props}>
      <ul className={clsx("breadcrumbs", size !== "md" && `breadcrumbs--${size}`)}>{children}</ul>
    </nav>
  );
}

export interface BreadcrumbsItemProps extends ComponentProps<"a"> {
  /** The label. */
  children: ReactNode;
  /** Highlights the item as the current page. */
  active?: boolean;
}

export function BreadcrumbsItem({
  children,
  active,
  className,
  ...props
}: BreadcrumbsItemProps): ReactNode {
  return (
    <li className={clsx("breadcrumbs__item", active && "breadcrumbs__item--active")}>
      <a
        className={clsx("breadcrumbs__link", className)}
        aria-current={active ? "page" : undefined}
        {...props}
      >
        {children}
      </a>
    </li>
  );
}
