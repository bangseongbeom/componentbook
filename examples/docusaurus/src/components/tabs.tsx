import clsx from "clsx";
import { type ComponentProps, createContext, type ReactNode, useContext, useState } from "react";

interface TabsContextValue {
  value: string | undefined;
  select: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

export interface TabsProps extends Omit<ComponentProps<"ul">, "defaultValue"> {
  /** The tabs, as `<TabsItem>` elements. */
  children: ReactNode;
  /** The value of the selected tab. Set it to control the selection yourself. */
  value?: string;
  /** The value of the tab that is selected at first. */
  defaultValue?: string;
  /** Called with the value of the tab that the user selects. */
  onValueChange?: (value: string) => void;
  /** Stretches the tabs to fill the full width of the container. */
  block?: boolean;
}

/**
 * @example
 * ### Standard
 *
 * ```tsx
 * <Tabs defaultValue="alpha">
 *   <TabsItem value="alpha">Alpha</TabsItem>
 *   <TabsItem value="beta">Beta</TabsItem>
 *   <TabsItem value="gamma">Gamma</TabsItem>
 *   <TabsItem value="zeta">Zeta</TabsItem>
 * </Tabs>
 * ```
 *
 * @example
 * ### Block
 *
 * ```tsx
 * <Tabs defaultValue="alpha" block>
 *   <TabsItem value="alpha">Alpha</TabsItem>
 *   <TabsItem value="beta">Beta</TabsItem>
 *   <TabsItem value="gamma">Gamma</TabsItem>
 *   <TabsItem value="zeta">Zeta</TabsItem>
 * </Tabs>
 * ```
 */
export function Tabs({
  children,
  value,
  defaultValue,
  onValueChange,
  block,
  className,
  ...props
}: TabsProps): ReactNode {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const select = (value: string) => {
    setUncontrolledValue(value);
    onValueChange?.(value);
  };

  return (
    <ul role="tablist" className={clsx("tabs", block && "tabs--block", className)} {...props}>
      <TabsContext.Provider value={{ value: value ?? uncontrolledValue, select }}>
        {children}
      </TabsContext.Provider>
    </ul>
  );
}

export interface TabsItemProps extends ComponentProps<"li"> {
  /** The label. */
  children: ReactNode;
  /** The value that identifies the tab in `<Tabs>`. */
  value: string;
}

export function TabsItem({
  children,
  value,
  className,
  onClick,
  onKeyDown,
  ...props
}: TabsItemProps): ReactNode {
  const tabs = useContext(TabsContext);
  const selected = tabs?.value === value;

  return (
    <li
      role="tab"
      tabIndex={0}
      aria-selected={selected}
      className={clsx("tabs__item", selected && "tabs__item--active", className)}
      onClick={(event) => {
        onClick?.(event);
        tabs?.select(value);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          tabs?.select(value);
        }
      }}
      {...props}
    >
      {children}
    </li>
  );
}
