import clsx from "clsx";
import { Children, type ComponentProps, type ReactNode, useState } from "react";

export interface MenuProps extends ComponentProps<"nav"> {
  /** The items, as `<MenuItem>` elements. */
  children: ReactNode;
}

/**
 * @example
 * ### Basic
 *
 * ```tsx
 * <Menu>
 *   <MenuItem href="#url" label="First Level Item" />
 *   <MenuItem href="#url" label="Active Item" active />
 *   <MenuItem href="#url" label="Third Level Item" />
 * </Menu>
 * ```
 *
 * @example
 * ### With Sublist
 *
 * ```tsx
 * <Menu>
 *   <MenuItem href="#url" label="Category">
 *     <MenuItem href="#url" label="Nested Item" />
 *     <MenuItem href="#url" label="Another Item" />
 *   </MenuItem>
 * </Menu>
 * ```
 *
 * @example
 * ### With Caret
 *
 * ```tsx
 * <Menu>
 *   <MenuItem href="#url" label="With Caret" caret="link">
 *     <MenuItem href="#url" label="First Item" />
 *     <MenuItem href="#url" label="Second Item" />
 *   </MenuItem>
 * </Menu>
 * ```
 *
 * @example
 * ### With Custom Caret Button
 *
 * ```tsx
 * <Menu>
 *   <MenuItem href="#url" label="Category" caret="button">
 *     <MenuItem href="#url" label="First Item" />
 *     <MenuItem href="#url" label="Second Item" />
 *   </MenuItem>
 * </Menu>
 * ```
 *
 * @example
 * ### Nested Levels
 *
 * ```tsx
 * <Menu>
 *   <MenuItem href="#url" label="First Level" caret="button" active>
 *     <MenuItem href="#url" label="Second Level" caret="button">
 *       <MenuItem href="#url" label="Third Level Item" />
 *       <MenuItem href="#url" label="Another Item" />
 *     </MenuItem>
 *   </MenuItem>
 * </Menu>
 * ```
 *
 * @example
 * ### Collapsed State
 *
 * Set `defaultCollapsed` to collapse a menu section:
 *
 * ```tsx
 * <Menu>
 *   <MenuItem href="#url" label="Collapsed Section" caret="button" defaultCollapsed>
 *     <MenuItem href="#url" label="Hidden Item" />
 *   </MenuItem>
 * </Menu>
 * ```
 */
export function Menu({ children, className, ...props }: MenuProps): ReactNode {
  return (
    <nav className={clsx("menu", className)} {...props}>
      <ul className="menu__list">{children}</ul>
    </nav>
  );
}

export interface MenuItemProps extends Omit<ComponentProps<"a">, "children"> {
  /** The text of the link. */
  label: ReactNode;
  /** The nested items, as `<MenuItem>` elements. */
  children?: ReactNode;
  /** Highlights the link as the current page. */
  active?: boolean;
  /**
   * Shows a caret for the nested items: on the link itself (`"link"`), or as a separate button (`"button"`).
   *
   * @remarks
   * Clicking the caret collapses the nested items. Without a caret, clicking the link does.
   */
  caret?: "link" | "button";
  /** Collapses the nested items at first. */
  defaultCollapsed?: boolean;
}

export function MenuItem({
  label,
  children,
  active,
  caret,
  defaultCollapsed = false,
  className,
  onClick,
  ...props
}: MenuItemProps): ReactNode {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const toggle = () => setCollapsed((collapsed) => !collapsed);
  const hasSublist = Children.count(children) > 0;
  const linkToggles = hasSublist && caret !== "button";

  const link = (
    <a
      className={clsx(
        "menu__link",
        linkToggles && "menu__link--sublist",
        hasSublist && caret === "link" && "menu__link--sublist-caret",
        active && "menu__link--active",
        className,
      )}
      aria-current={active && !hasSublist ? "page" : undefined}
      aria-expanded={linkToggles ? !collapsed : undefined}
      onClick={(event) => {
        onClick?.(event);
        if (linkToggles) toggle();
      }}
      {...props}
    >
      {label}
    </a>
  );

  return (
    <li
      className={clsx("menu__list-item", hasSublist && collapsed && "menu__list-item--collapsed")}
    >
      {hasSublist && caret ? (
        <div
          className={clsx(
            "menu__list-item-collapsible",
            active && "menu__list-item-collapsible--active",
          )}
        >
          {link}
          {caret === "button" && (
            <button
              type="button"
              className="clean-btn menu__caret"
              aria-label={collapsed ? "Expand" : "Collapse"}
              aria-expanded={!collapsed}
              onClick={toggle}
            />
          )}
        </div>
      ) : (
        link
      )}
      {hasSublist && <ul className="menu__list">{children}</ul>}
    </li>
  );
}
