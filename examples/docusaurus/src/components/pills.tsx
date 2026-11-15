import clsx from "clsx";
import { type ComponentProps, createContext, type ReactNode, useContext, useState } from "react";

interface PillsContextValue {
  value: string | undefined;
  select: (value: string) => void;
}

const PillsContext = createContext<PillsContextValue | undefined>(undefined);

export interface PillsProps extends Omit<ComponentProps<"ul">, "defaultValue"> {
  /** The items, as `<PillsItem>` elements. */
  children: ReactNode;
  /** The value of the selected item. Set it to control the selection yourself. */
  value?: string;
  /** The value of the item that is selected at first. */
  defaultValue?: string;
  /** Called with the value of the item that the user selects. */
  onValueChange?: (value: string) => void;
  /** Stretches the items to fill the full width of the container. */
  block?: boolean;
}

/**
 * @example
 * ### Standard
 *
 * ```tsx
 * <Pills defaultValue="alpha">
 *   <PillsItem value="alpha">Alpha</PillsItem>
 *   <PillsItem value="beta">Beta</PillsItem>
 *   <PillsItem value="gamma">Gamma</PillsItem>
 *   <PillsItem value="zeta">Zeta</PillsItem>
 * </Pills>
 * ```
 *
 * @example
 * ### Block
 *
 * ```tsx
 * <Pills defaultValue="alpha" block>
 *   <PillsItem value="alpha">Alpha</PillsItem>
 *   <PillsItem value="beta">Beta</PillsItem>
 *   <PillsItem value="gamma">Gamma</PillsItem>
 *   <PillsItem value="zeta">Zeta</PillsItem>
 * </Pills>
 * ```
 */
export function Pills({
  children,
  value,
  defaultValue,
  onValueChange,
  block,
  className,
  ...props
}: PillsProps): ReactNode {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const select = (value: string) => {
    setUncontrolledValue(value);
    onValueChange?.(value);
  };

  return (
    <ul role="tablist" className={clsx("pills", block && "pills--block", className)} {...props}>
      <PillsContext.Provider value={{ value: value ?? uncontrolledValue, select }}>
        {children}
      </PillsContext.Provider>
    </ul>
  );
}

export interface PillsItemProps extends ComponentProps<"li"> {
  /** The label. */
  children: ReactNode;
  /** The value that identifies the item in `<Pills>`. */
  value: string;
}

export function PillsItem({
  children,
  value,
  className,
  onClick,
  onKeyDown,
  ...props
}: PillsItemProps): ReactNode {
  const pills = useContext(PillsContext);
  const selected = pills?.value === value;

  return (
    <li
      role="tab"
      tabIndex={0}
      aria-selected={selected}
      className={clsx("pills__item", selected && "pills__item--active", className)}
      onClick={(event) => {
        onClick?.(event);
        pills?.select(value);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          pills?.select(value);
        }
      }}
      {...props}
    >
      {children}
    </li>
  );
}
