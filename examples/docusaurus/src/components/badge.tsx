import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";

export interface BadgeProps extends ComponentProps<"span"> {
  /** The label. */
  children: ReactNode;
  /** The color, from the Infima theme. */
  variant?: "primary" | "secondary" | "success" | "info" | "warning" | "danger";
}

/**
 * @example
 * ### Colors
 *
 * #### Primary
 *
 * ```tsx
 * <Badge variant="primary">Primary</Badge>
 * ```
 *
 * @example
 * #### Secondary
 *
 * ```tsx
 * <Badge variant="secondary">Secondary</Badge>
 * ```
 *
 * @example
 * #### Success
 *
 * ```tsx
 * <Badge variant="success">Success</Badge>
 * ```
 *
 * @example
 * #### Info
 *
 * ```tsx
 * <Badge variant="info">Info</Badge>
 * ```
 *
 * @example
 * #### Warning
 *
 * ```tsx
 * <Badge variant="warning">Warning</Badge>
 * ```
 *
 * @example
 * #### Danger
 *
 * ```tsx
 * <Badge variant="danger">Danger</Badge>
 * ```
 */
export function Badge({
  children,
  variant = "primary",
  className,
  ...props
}: BadgeProps): ReactNode {
  return (
    <span className={clsx("badge", `badge--${variant}`, className)} {...props}>
      {children}
    </span>
  );
}
