import clsx from "clsx";
import { Children, type ComponentProps, Fragment, type ReactNode } from "react";

export interface FooterProps extends ComponentProps<"footer"> {
  /** The content, like `<FooterLinks>` or `<FooterColumns>`, followed by a copyright. */
  children: ReactNode;
  /** Uses a dark background, in both color modes. */
  dark?: boolean;
}

/**
 * @example
 * ### Simple
 *
 * ```tsx
 * <Footer>
 *   <FooterLinks>
 *     <FooterLink href="#url">Documentation</FooterLink>
 *     <FooterLink href="#url">GitHub</FooterLink>
 *     <FooterLink href="#url">Blog</FooterLink>
 *     <FooterLink href="#url">Contribute</FooterLink>
 *   </FooterLinks>
 *   <div>Copyright © 2022 Meta Platforms, Inc.</div>
 * </Footer>
 * ```
 *
 * @example
 * ### Multi-Column
 *
 * ```tsx
 * <Footer>
 *   <FooterColumns>
 *     <FooterColumn title="Docs">
 *       <FooterLink href="#url">Getting Started</FooterLink>
 *       <FooterLink href="#url">API</FooterLink>
 *       <FooterLink href="#url">FAQ</FooterLink>
 *     </FooterColumn>
 *     <FooterColumn title="Community">
 *       <FooterLink href="#url">Users</FooterLink>
 *       <FooterLink href="#url">Contribute</FooterLink>
 *       <FooterLink href="#url">Stack Overflow</FooterLink>
 *     </FooterColumn>
 *     <FooterColumn title="Social">
 *       <FooterLink href="#url">GitHub</FooterLink>
 *       <FooterLink href="#url">Facebook</FooterLink>
 *       <FooterLink href="#url">Twitter</FooterLink>
 *     </FooterColumn>
 *     <FooterColumn title="More">
 *       <FooterLink href="#url">Tutorial</FooterLink>
 *       <FooterLink href="#url">Blog</FooterLink>
 *     </FooterColumn>
 *   </FooterColumns>
 *   <div className="text--center">
 *     <div className="margin-bottom--sm">
 *       <img className="footer__logo" alt="Docusaurus Logo" src="/img/logo.svg" />
 *     </div>
 *     Copyright © 2022 Meta Platforms, Inc.
 *   </div>
 * </Footer>
 * ```
 *
 * @example
 * ### Dark
 *
 * ```tsx
 * <Footer dark>
 *   <FooterLinks>
 *     <FooterLink href="#url">Documentation</FooterLink>
 *     <FooterLink href="#url">GitHub</FooterLink>
 *     <FooterLink href="#url">Blog</FooterLink>
 *     <FooterLink href="#url">Contribute</FooterLink>
 *   </FooterLinks>
 *   <div>Copyright © 2022 Meta Platforms, Inc.</div>
 * </Footer>
 * ```
 *
 * @example
 * ```tsx
 * <Footer dark>
 *   <FooterColumns>
 *     <FooterColumn title="Docs">
 *       <FooterLink href="#url">Getting Started</FooterLink>
 *       <FooterLink href="#url">API</FooterLink>
 *       <FooterLink href="#url">FAQ</FooterLink>
 *     </FooterColumn>
 *     <FooterColumn title="Community">
 *       <FooterLink href="#url">Users</FooterLink>
 *       <FooterLink href="#url">Contribute</FooterLink>
 *       <FooterLink href="#url">Stack Overflow</FooterLink>
 *     </FooterColumn>
 *     <FooterColumn title="Social">
 *       <FooterLink href="#url">GitHub</FooterLink>
 *       <FooterLink href="#url">Facebook</FooterLink>
 *       <FooterLink href="#url">Twitter</FooterLink>
 *     </FooterColumn>
 *     <FooterColumn title="More">
 *       <FooterLink href="#url">Tutorial</FooterLink>
 *       <FooterLink href="#url">Blog</FooterLink>
 *     </FooterColumn>
 *   </FooterColumns>
 *   <div className="text--center">
 *     <div className="margin-bottom--sm">
 *       <img className="footer__logo" alt="Docusaurus Logo" src="/img/logo.svg" />
 *     </div>
 *     Copyright © 2022 Meta Platforms, Inc.
 *   </div>
 * </Footer>
 * ```
 */
export function Footer({ children, dark, className, ...props }: FooterProps): ReactNode {
  return (
    <footer className={clsx("footer", dark && "footer--dark", className)} {...props}>
      <div className="container container--fluid">{children}</div>
    </footer>
  );
}

export interface FooterLinksProps extends ComponentProps<"div"> {
  /** The links, as `<FooterLink>` elements. */
  children: ReactNode;
}

export function FooterLinks({ children, className, ...props }: FooterLinksProps): ReactNode {
  return (
    <div className={clsx("footer__links", className)} {...props}>
      {Children.toArray(children).map((child, index) => (
        <Fragment key={index}>
          {index > 0 && <span className="footer__link-separator">&middot;</span>}
          {child}
        </Fragment>
      ))}
    </div>
  );
}

export interface FooterColumnsProps extends ComponentProps<"div"> {
  /** The columns, as `<FooterColumn>` elements. */
  children: ReactNode;
}

export function FooterColumns({ children, className, ...props }: FooterColumnsProps): ReactNode {
  return (
    <div className={clsx("row footer__links", className)} {...props}>
      {children}
    </div>
  );
}

export interface FooterColumnProps extends Omit<ComponentProps<"div">, "title"> {
  /** The heading of the column. */
  title: ReactNode;
  /** The links, as `<FooterLink>` elements. */
  children: ReactNode;
}

export function FooterColumn({
  title,
  children,
  className,
  ...props
}: FooterColumnProps): ReactNode {
  return (
    <div className={clsx("col footer__col", className)} {...props}>
      <h4 className="footer__title">{title}</h4>
      <ul className="footer__items clean-list">
        {Children.toArray(children).map((child, index) => (
          <li key={index} className="footer__item">
            {child}
          </li>
        ))}
      </ul>
    </div>
  );
}

export interface FooterLinkProps extends ComponentProps<"a"> {
  /** The label. */
  children: ReactNode;
}

export function FooterLink({ children, className, ...props }: FooterLinkProps): ReactNode {
  return (
    <a className={clsx("footer__link-item", className)} {...props}>
      {children}
    </a>
  );
}
