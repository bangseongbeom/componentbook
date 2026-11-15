import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";

export interface NavbarProps extends ComponentProps<"nav"> {
  /** The groups of items, as `<NavbarItems>` elements. */
  children: ReactNode;
  /** The background color. By default, it's the color of the page's surface. */
  variant?: "dark" | "primary";
}

/**
 * @example
 * ### Standard
 *
 * ```tsx
 * <Navbar>
 *   <NavbarItems>
 *     <NavbarBrand href="#url">Infima</NavbarBrand>
 *     <NavbarLink href="#url">Docs</NavbarLink>
 *     <NavbarLink href="#url">Tutorial</NavbarLink>
 *     <NavbarDropdown href="#url" label="v2.0">
 *       <NavbarDropdownItem href="#url">v1.8.0</NavbarDropdownItem>
 *       <NavbarDropdownItem href="#url">v1.7.0</NavbarDropdownItem>
 *       <NavbarDropdownItem href="#url">v1.6.0</NavbarDropdownItem>
 *       <NavbarDropdownItem href="#url">All Versions</NavbarDropdownItem>
 *     </NavbarDropdown>
 *   </NavbarItems>
 *   <NavbarItems position="right">
 *     <NavbarSearch placeholder="Search" />
 *   </NavbarItems>
 * </Navbar>
 * ```
 *
 * @example
 * ### Dark
 *
 * ```tsx
 * <Navbar variant="dark">
 *   <NavbarItems>
 *     <NavbarBrand href="#url">Infima</NavbarBrand>
 *     <NavbarDropdown href="#url" label="v2.0">
 *       <NavbarDropdownItem href="#url">v1.8.0</NavbarDropdownItem>
 *       <NavbarDropdownItem href="#url">v1.7.0</NavbarDropdownItem>
 *       <NavbarDropdownItem href="#url">v1.6.0</NavbarDropdownItem>
 *       <NavbarDropdownItem href="#url">All Versions</NavbarDropdownItem>
 *     </NavbarDropdown>
 *   </NavbarItems>
 *   <NavbarItems position="right">
 *     <NavbarLink href="#url">Docs</NavbarLink>
 *     <NavbarLink href="#url">Tutorial</NavbarLink>
 *     <NavbarSearch placeholder="Search" />
 *   </NavbarItems>
 * </Navbar>
 * ```
 *
 * @example
 * ### With Dropdown Menu
 *
 * ```tsx
 * <Navbar variant="primary">
 *   <NavbarItems>
 *     <NavbarLink href="#url">Docs</NavbarLink>
 *     <NavbarLink href="#url">Tutorial</NavbarLink>
 *     <NavbarDropdown href="#url" label="v2.0">
 *       <NavbarDropdownItem href="#url">v1.8.0</NavbarDropdownItem>
 *       <NavbarDropdownItem href="#url">v1.7.0</NavbarDropdownItem>
 *       <NavbarDropdownItem href="#url">v1.6.0</NavbarDropdownItem>
 *       <NavbarDropdownItem href="#url">All Versions</NavbarDropdownItem>
 *     </NavbarDropdown>
 *   </NavbarItems>
 *   <NavbarItems position="center">
 *     <NavbarBrand href="#url">Infima</NavbarBrand>
 *   </NavbarItems>
 *   <NavbarItems position="right">
 *     <NavbarDropdown href="#url" label="Languages" align="right">
 *       <NavbarDropdownItem href="#url">简体中文</NavbarDropdownItem>
 *       <NavbarDropdownItem href="#url">日本語</NavbarDropdownItem>
 *       <NavbarDropdownItem href="#url">Français</NavbarDropdownItem>
 *       <NavbarDropdownItem href="#url">Español</NavbarDropdownItem>
 *     </NavbarDropdown>
 *     <NavbarSearch placeholder="Search" />
 *   </NavbarItems>
 * </Navbar>
 * ```
 */
export function Navbar({ children, variant, className, ...props }: NavbarProps): ReactNode {
  return (
    <nav className={clsx("navbar", variant && `navbar--${variant}`, className)} {...props}>
      <div className="navbar__inner">{children}</div>
    </nav>
  );
}

export interface NavbarItemsProps extends ComponentProps<"div"> {
  /** The items, like `<NavbarBrand>`, `<NavbarLink>`, `<NavbarDropdown>` and `<NavbarSearch>`. */
  children: ReactNode;
  /** The side of `<Navbar>` that the group is aligned to. */
  position?: "left" | "center" | "right";
}

export function NavbarItems({
  children,
  position = "left",
  className,
  ...props
}: NavbarItemsProps): ReactNode {
  return (
    <div
      className={clsx(
        "navbar__items",
        position !== "left" && `navbar__items--${position}`,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface NavbarBrandProps extends ComponentProps<"a"> {
  /** The name of the site, or its logo. */
  children: ReactNode;
}

export function NavbarBrand({ children, className, ...props }: NavbarBrandProps): ReactNode {
  return (
    <a className={clsx("navbar__brand", className)} {...props}>
      {children}
    </a>
  );
}

export interface NavbarLinkProps extends ComponentProps<"a"> {
  /** The label. */
  children: ReactNode;
  /** Highlights the link as the current page. */
  active?: boolean;
}

export function NavbarLink({ children, active, className, ...props }: NavbarLinkProps): ReactNode {
  return (
    <a
      className={clsx("navbar__item navbar__link", active && "navbar__link--active", className)}
      aria-current={active ? "page" : undefined}
      {...props}
    >
      {children}
    </a>
  );
}

export interface NavbarDropdownProps extends Omit<ComponentProps<"a">, "children"> {
  /** The text of the link that opens the menu on hover. */
  label: ReactNode;
  /** The menu items, as `<NavbarDropdownItem>` elements. */
  children: ReactNode;
  /** The edge of the link that the menu is aligned to. */
  align?: "left" | "right";
}

export function NavbarDropdown({
  label,
  children,
  align = "left",
  className,
  ...props
}: NavbarDropdownProps): ReactNode {
  return (
    <div
      className={clsx(
        "navbar__item dropdown dropdown--hoverable",
        align === "right" && "dropdown--right",
      )}
    >
      <a className={clsx("navbar__link", className)} aria-haspopup="true" {...props}>
        {label}
      </a>
      <ul className="dropdown__menu">{children}</ul>
    </div>
  );
}

export interface NavbarDropdownItemProps extends ComponentProps<"a"> {
  /** The label. */
  children: ReactNode;
  /** Highlights the item as the current one. */
  active?: boolean;
}

export function NavbarDropdownItem({
  children,
  active,
  className,
  ...props
}: NavbarDropdownItemProps): ReactNode {
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

export function NavbarSearch({ className, ...props }: ComponentProps<"input">): ReactNode {
  return (
    <div className="navbar__search">
      <input
        type="search"
        aria-label="Search"
        className={clsx("navbar__search-input", className)}
        {...props}
      />
    </div>
  );
}
