import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";

export interface CardProps extends ComponentProps<"div"> {
  /** The sections, as `<CardHeader>`, `<CardImage>`, `<CardBody>` and `<CardFooter>` elements. */
  children: ReactNode;
  /** Stretches the card to the full height of its container. */
  fullHeight?: boolean;
}

/**
 * @example
 * ### Simple Card
 *
 * ```tsx
 * import { Button } from "@site/src/components/button";
 *
 * <div style={{ maxWidth: 320, margin: "0 auto" }}>
 *   <Card>
 *     <CardHeader>
 *       <h3>Lorem Ipsum</h3>
 *     </CardHeader>
 *     <CardBody>
 *       <p>
 *         Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
 *         ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida.
 *       </p>
 *     </CardBody>
 *     <CardFooter>
 *       <Button variant="secondary" block>See All</Button>
 *     </CardFooter>
 *   </Card>
 * </div>
 * ```
 *
 * @example
 * ### Feed Item
 *
 * ```tsx
 * import { Avatar } from "@site/src/components/avatar";
 * import { Button } from "@site/src/components/button";
 *
 * <div style={{ maxWidth: 320, margin: "0 auto" }}>
 *   <Card>
 *     <CardHeader>
 *       <Avatar
 *         src="https://avatars1.githubusercontent.com/u/4060187?s=460&v=4"
 *         name="Jared Palmer"
 *         subtitle="Consultant, Speaker, Lead Engineer"
 *       />
 *     </CardHeader>
 *     <CardImage>
 *       <img
 *         src="https://images.unsplash.com/photo-1501619951397-5ba40d0f75da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1655&q=80"
 *         alt="Image alt text"
 *         title="Logo Title Text 1"
 *       />
 *     </CardImage>
 *     <CardFooter>
 *       <div className="button-group button-group--block">
 *         <Button variant="secondary">Like</Button>
 *         <Button variant="secondary">Comment</Button>
 *         <Button variant="secondary">Share</Button>
 *       </div>
 *     </CardFooter>
 *   </Card>
 * </div>
 * ```
 *
 * @example
 * ### Photo-centric
 *
 * ```tsx
 * import { Button } from "@site/src/components/button";
 *
 * <div style={{ maxWidth: 320, margin: "0 auto" }}>
 *   <Card>
 *     <CardImage>
 *       <img
 *         src="https://images.unsplash.com/photo-1506624183912-c602f4a21ca7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
 *         alt="Image alt text"
 *         title="Logo Title Text 1"
 *       />
 *     </CardImage>
 *     <CardBody>
 *       <h4>Quaco Lighthouse</h4>
 *       <small>
 *         The Quaco Head Lighthouse is a well maintained lighthouse close to St. Martins. It is a
 *         short, beautiful walk to the lighthouse along the seashore.
 *       </small>
 *     </CardBody>
 *     <CardFooter>
 *       <Button variant="primary" block>Visit</Button>
 *     </CardFooter>
 *   </Card>
 * </div>
 * ```
 */
export function Card({ children, fullHeight, className, ...props }: CardProps): ReactNode {
  return (
    <div className={clsx("card", fullHeight && "card--full-height", className)} {...props}>
      {children}
    </div>
  );
}

export interface CardSectionProps extends ComponentProps<"div"> {
  /** The content. */
  children: ReactNode;
}

export function CardHeader({ children, className, ...props }: CardSectionProps): ReactNode {
  return (
    <div className={clsx("card__header", className)} {...props}>
      {children}
    </div>
  );
}

export function CardImage({ children, className, ...props }: CardSectionProps): ReactNode {
  return (
    <div className={clsx("card__image", className)} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ children, className, ...props }: CardSectionProps): ReactNode {
  return (
    <div className={clsx("card__body", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }: CardSectionProps): ReactNode {
  return (
    <div className={clsx("card__footer", className)} {...props}>
      {children}
    </div>
  );
}
