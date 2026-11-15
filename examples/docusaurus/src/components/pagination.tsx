import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";

export interface PaginationProps extends ComponentProps<"nav"> {
  /** The items, as `<PaginationItem>` elements. */
  children: ReactNode;
  /** The size. */
  size?: "sm" | "md" | "lg";
}

/**
 * @example
 * ### Default
 *
 * ```tsx
 * <Pagination>
 *   <PaginationItem href="#url" disabled>&laquo;</PaginationItem>
 *   <PaginationItem href="#url">1</PaginationItem>
 *   <PaginationItem href="#url" active>2</PaginationItem>
 *   <PaginationItem href="#url">3</PaginationItem>
 *   <PaginationItem>...</PaginationItem>
 *   <PaginationItem href="#url">&raquo;</PaginationItem>
 * </Pagination>
 * ```
 *
 * @example
 * ### Small
 *
 * ```tsx
 * <Pagination size="sm">
 *   <PaginationItem href="#url">&laquo;</PaginationItem>
 *   <PaginationItem>...</PaginationItem>
 *   <PaginationItem href="#url">5</PaginationItem>
 *   <PaginationItem href="#url" active>6</PaginationItem>
 *   <PaginationItem href="#url">7</PaginationItem>
 *   <PaginationItem>...</PaginationItem>
 *   <PaginationItem href="#url">&raquo;</PaginationItem>
 * </Pagination>
 * ```
 *
 * @example
 * ### Large
 *
 * ```tsx
 * <Pagination size="lg">
 *   <PaginationItem href="#url">&laquo;</PaginationItem>
 *   <PaginationItem>...</PaginationItem>
 *   <PaginationItem href="#url">7</PaginationItem>
 *   <PaginationItem href="#url">8</PaginationItem>
 *   <PaginationItem href="#url" active>9</PaginationItem>
 *   <PaginationItem href="#url" disabled>&raquo;</PaginationItem>
 * </Pagination>
 * ```
 */
export function Pagination({
  children,
  size = "md",
  className,
  ...props
}: PaginationProps): ReactNode {
  return (
    <nav aria-label="pagination" className={className} {...props}>
      <ul className={clsx("pagination", size !== "md" && `pagination--${size}`)}>{children}</ul>
    </nav>
  );
}

export interface PaginationItemProps extends ComponentProps<"a"> {
  /** The label, like a page number. */
  children: ReactNode;
  /** Highlights the item as the current page. */
  active?: boolean;
  /** Dims the item, and ignores clicks. */
  disabled?: boolean;
}

export function PaginationItem({
  children,
  active,
  disabled,
  className,
  ...props
}: PaginationItemProps): ReactNode {
  return (
    <li
      className={clsx(
        "pagination__item",
        active && "pagination__item--active",
        disabled && "pagination__item--disabled",
      )}
    >
      {props.href === undefined ? (
        <span className={className}>{children}</span>
      ) : (
        <a
          className={clsx("pagination__link", className)}
          aria-current={active ? "page" : undefined}
          aria-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : undefined}
          {...props}
        >
          {children}
        </a>
      )}
    </li>
  );
}
