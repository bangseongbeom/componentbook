import clsx from "clsx";
import { type ComponentProps, type ReactNode, useState } from "react";

export interface AlertProps extends ComponentProps<"div"> {
  /** The message. */
  children: ReactNode;
  /** The color, from the Infima theme. */
  variant?: "primary" | "secondary" | "success" | "info" | "warning" | "danger";
  /** Shows a close button, which removes the alert when clicked. */
  closable?: boolean;
  /** Called when the close button is clicked. */
  onClose?: () => void;
}

/**
 * @example
 * ### Colors
 *
 * #### Primary
 *
 * ```tsx
 * <Alert variant="primary" closable>
 *   This is a <strong>primary</strong> alert. You should probably pay attention to it.
 * </Alert>
 * ```
 *
 * @example
 * #### Secondary
 *
 * ```tsx
 * <Alert variant="secondary" closable>
 *   This is a <strong>secondary</strong> alert. It's not too important, you may ignore it.
 * </Alert>
 * ```
 *
 * @example
 * #### Success
 *
 * ```tsx
 * <Alert variant="success" closable>
 *   This is a <strong>success</strong> alert. Something good must have happened!
 * </Alert>
 * ```
 *
 * @example
 * #### Info
 *
 * ```tsx
 * <Alert variant="info" closable>
 *   This is an <strong>info</strong> alert. For your information only.
 * </Alert>
 * ```
 *
 * @example
 * #### Warning
 *
 * ```tsx
 * <Alert variant="warning" closable>
 *   This is a <strong>warning</strong> alert. Be warned, you should pay attention!
 * </Alert>
 * ```
 *
 * @example
 * #### Danger
 *
 * ```tsx
 * <Alert variant="danger" closable>
 *   This is a <strong>danger</strong> alert. Something has gone wrong, please investigate!
 * </Alert>
 * ```
 */
export function Alert({
  children,
  variant = "primary",
  closable = false,
  onClose,
  className,
  ...props
}: AlertProps): ReactNode {
  const [closed, setClosed] = useState(false);
  if (closed) return null;

  return (
    <div role="alert" className={clsx("alert", `alert--${variant}`, className)} {...props}>
      {closable && (
        <button
          type="button"
          aria-label="Close"
          className="clean-btn close"
          onClick={() => {
            setClosed(true);
            onClose?.();
          }}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      )}
      {children}
    </div>
  );
}
