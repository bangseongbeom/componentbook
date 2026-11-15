import clsx from "clsx";
import { type ComponentProps, type ReactNode, useEffect, useRef, useState } from "react";

export interface DropdownProps extends Omit<ComponentProps<"div">, "children"> {
  /** The label of the button that opens the menu. */
  label: ReactNode;
  /** The menu items, as `<DropdownItem>` elements. */
  children: ReactNode;
  /** The color of the button, from the Infima theme. */
  variant?: "primary" | "secondary" | "success" | "info" | "warning" | "danger";
  /** Opens the menu on hover, instead of on click. */
  hoverable?: boolean;
  /** The edge of the button that the menu is aligned to. */
  align?: "left" | "right";
}

/**
 * @example
 * ### Hoverable
 *
 * ```tsx
 * <Dropdown label="Hover Me" variant="primary" hoverable>
 *   <DropdownItem href="#url">Home</DropdownItem>
 *   <DropdownItem href="#url">Profile</DropdownItem>
 *   <DropdownItem href="#url">Settings</DropdownItem>
 *   <DropdownItem href="#url">Help</DropdownItem>
 *   <DropdownItem href="#url">Logout</DropdownItem>
 * </Dropdown>
 * ```
 *
 * @example
 * ### Clickable
 *
 * ```tsx
 * <Dropdown label="Click Me" variant="secondary">
 *   <DropdownItem href="#url">Home</DropdownItem>
 *   <DropdownItem href="#url">Profile</DropdownItem>
 *   <DropdownItem href="#url">Settings</DropdownItem>
 *   <DropdownItem href="#url">Help</DropdownItem>
 *   <DropdownItem href="#url">Logout</DropdownItem>
 * </Dropdown>
 * ```
 *
 * @example
 * ### Right-Aligned
 *
 * ```tsx
 * <Dropdown label="Right-Aligned Long Children" variant="info" align="right">
 *   <DropdownItem href="#url">This is a very long item</DropdownItem>
 *   <DropdownItem href="#url">And so is this item</DropdownItem>
 *   <DropdownItem href="#url">Who are you kidding, I'm the longessssssssst!</DropdownItem>
 * </Dropdown>
 * ```
 */
export function Dropdown({
  label,
  children,
  variant = "primary",
  hoverable = false,
  align = "left",
  className,
  ...props
}: DropdownProps): ReactNode {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Like Infima's `dropdowns.js`, a click anywhere else closes the menu.
  useEffect(() => {
    if (!open) return;

    const close = (event: MouseEvent) => {
      if (!toggleRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);

  return (
    <div
      className={clsx(
        "dropdown",
        hoverable && "dropdown--hoverable",
        align === "right" && "dropdown--right",
        open && "dropdown--show",
        className,
      )}
      {...props}
    >
      <button
        ref={toggleRef}
        type="button"
        className={clsx("button", `button--${variant}`, open && "button--active")}
        aria-haspopup="true"
        aria-expanded={hoverable ? undefined : open}
        onClick={hoverable ? undefined : () => setOpen((open) => !open)}
      >
        {label}
      </button>
      <ul className="dropdown__menu">{children}</ul>
    </div>
  );
}

export interface DropdownItemProps extends ComponentProps<"a"> {
  /** The label. */
  children: ReactNode;
  /** Highlights the item as the current one. */
  active?: boolean;
}

export function DropdownItem({
  children,
  active,
  className,
  ...props
}: DropdownItemProps): ReactNode {
  return (
    <li>
      <a
        className={clsx("dropdown__link", active && "dropdown__link--active", className)}
        {...props}
      >
        {children}
      </a>
    </li>
  );
}
