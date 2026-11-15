import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";

export interface ButtonStyleProps {
  /** The color, from the Infima theme. */
  variant?: "primary" | "secondary" | "success" | "info" | "warning" | "danger" | "link";
  /** The size. */
  size?: "sm" | "md" | "lg";
  /** Shows only the border, with a transparent background. */
  outline?: boolean;
  /** Shows the button as pressed. */
  active?: boolean;
  /** Stretches the button to the full width of its container. */
  block?: boolean;
}

export interface ButtonProps extends ButtonStyleProps, ComponentProps<"button"> {
  /** The label. */
  children: ReactNode;
  /** The behavior in a form. Unlike a native `<button>`, it doesn't submit forms by default. */
  type?: "button" | "submit" | "reset";
}

/**
 * @example
 * ### Colors
 *
 * ```tsx
 * <div>
 *   <Button variant="primary">Primary</Button>{" "}
 *   <Button variant="secondary">Secondary</Button>{" "}
 *   <Button variant="success">Success</Button>{" "}
 *   <Button variant="info">Info</Button>{" "}
 *   <Button variant="warning">Warning</Button>{" "}
 *   <Button variant="danger">Danger</Button>{" "}
 *   <Button variant="link">Link</Button>
 * </div>
 * ```
 *
 * @example
 * ### Outline
 *
 * ```tsx
 * <div>
 *   <Button variant="primary" outline>Primary</Button>{" "}
 *   <Button variant="secondary" outline>Secondary</Button>{" "}
 *   <Button variant="success" outline>Success</Button>{" "}
 *   <Button variant="info" outline>Info</Button>{" "}
 *   <Button variant="warning" outline>Warning</Button>{" "}
 *   <Button variant="danger" outline>Danger</Button>
 * </div>
 * ```
 *
 * @example
 * ### Active
 *
 * ```tsx
 * <div>
 *   <Button variant="primary" active>Primary</Button>{" "}
 *   <Button variant="secondary" active>Secondary</Button>{" "}
 *   <Button variant="success" active>Success</Button>{" "}
 *   <Button variant="info" active>Info</Button>{" "}
 *   <Button variant="warning" active>Warning</Button>{" "}
 *   <Button variant="danger" active>Danger</Button>{" "}
 *   <Button variant="link" active>Link</Button>
 * </div>
 * ```
 *
 * @example
 * ### Disabled
 *
 * ```tsx
 * <div>
 *   <Button variant="primary" disabled>Primary</Button>{" "}
 *   <Button variant="secondary" disabled>Secondary</Button>{" "}
 *   <Button variant="success" disabled>Success</Button>{" "}
 *   <Button variant="info" disabled>Info</Button>{" "}
 *   <Button variant="warning" disabled>Warning</Button>{" "}
 *   <Button variant="danger" disabled>Danger</Button>{" "}
 *   <Button variant="link" disabled>Link</Button>
 * </div>
 * ```
 *
 * @example
 * ### Sizes
 *
 * ```tsx
 * <div>
 *   <Button size="sm">Small Button</Button>{" "}
 *   <Button>Default Button</Button>{" "}
 *   <Button size="lg">Large Button</Button>
 * </div>
 * ```
 *
 * @example
 * ### Block
 *
 * ```tsx
 * <Button block>Block Button</Button>
 * ```
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  outline,
  active,
  block,
  type = "button",
  className,
  ...props
}: ButtonProps): ReactNode {
  return (
    <button
      type={type}
      className={clsx(buttonClassName({ variant, size, outline, active, block }), className)}
      {...props}
    >
      {children}
    </button>
  );
}

export interface ButtonLinkProps extends ButtonStyleProps, ComponentProps<"a"> {
  /** The label. */
  children: ReactNode;
  /** Dims the link, and ignores clicks. */
  disabled?: boolean;
}

/**
 * @example
 * Links can also be styled as buttons.
 *
 * ```tsx
 * <div>
 *   <ButtonLink variant="primary" href="#url">Primary</ButtonLink>{" "}
 *   <ButtonLink variant="secondary" href="#url">Secondary</ButtonLink>{" "}
 *   <ButtonLink variant="success" href="#url">Success</ButtonLink>{" "}
 *   <ButtonLink variant="info" href="#url">Info</ButtonLink>{" "}
 *   <ButtonLink variant="warning" href="#url">Warning</ButtonLink>{" "}
 *   <ButtonLink variant="danger" href="#url">Danger</ButtonLink>{" "}
 *   <ButtonLink variant="link" href="#url">Link</ButtonLink>
 * </div>
 * ```
 */
export function ButtonLink({
  children,
  variant = "primary",
  size = "md",
  outline,
  active,
  block,
  disabled,
  className,
  ...props
}: ButtonLinkProps): ReactNode {
  return (
    <a
      className={clsx(
        buttonClassName({ variant, size, outline, active, block }),
        disabled && "disabled",
        className,
      )}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      {...props}
    >
      {children}
    </a>
  );
}

/** Returns the Infima classes of a button, to style other elements as buttons. */
export function buttonClassName({
  variant = "primary",
  size = "md",
  outline,
  active,
  block,
}: ButtonStyleProps = {}): string {
  return clsx(
    "button",
    `button--${variant}`,
    size !== "md" && `button--${size}`,
    outline && "button--outline",
    active && "button--active",
    block && "button--block",
  );
}
