import type { ReactNode } from "react";

/** A prop, with its code highlighted and its description rendered at build time as HTML strings. */
export interface ComponentbookTypeNode {
  description?: string;
  type: string;
  typeDescription?: string;
  default?: string;
  required?: boolean;
  deprecated?: boolean;
}

/** Renders a type table whose rows expand to show the details. The highlighting must be done at build time. */
export function ComponentbookTypeTable({
  type,
}: {
  type: Record<string, ComponentbookTypeNode>;
}): ReactNode {
  return (
    <div className="componentbook-type-table">
      <div className="componentbook-type-table__header">
        <span className="componentbook-type-table__name">Prop</span>
        <span className="componentbook-type-table__type">Type</span>
      </div>
      {Object.entries(type).map(([name, node]) => (
        <Item key={name} name={name} node={node} />
      ))}
    </div>
  );
}

function Item({ name, node }: { name: string; node: ComponentbookTypeNode }): ReactNode {
  return (
    <details className="componentbook-type-table__item">
      <summary>
        <code
          className={
            node.deprecated
              ? "componentbook-type-table__name componentbook-type-table__name--deprecated"
              : "componentbook-type-table__name"
          }
        >
          {name}
          {!node.required && "?"}
        </code>
        <span className="componentbook-type-table__type">{renderCode(node.type)}</span>
        <ChevronDown className="componentbook-type-table__chevron" />
      </summary>
      <div className="componentbook-type-table__content">
        {node.description && (
          <div
            className="componentbook-type-table__description"
            dangerouslySetInnerHTML={{ __html: node.description }}
          />
        )}
        {(node.typeDescription || node.default) && (
          <dl>
            {node.typeDescription && (
              <>
                <dt>Type</dt>
                <dd>{renderCode(node.typeDescription)}</dd>
              </>
            )}
            {node.default && (
              <>
                <dt>Default</dt>
                <dd>{renderCode(node.default)}</dd>
              </>
            )}
          </dl>
        )}
      </div>
    </details>
  );
}

function renderCode(html: string): ReactNode {
  return <code className="componentbook-code" dangerouslySetInnerHTML={{ __html: html }} />;
}

/** https://lucide.dev/icons/chevron-down */
function ChevronDown({ className }: { className?: string }): ReactNode {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
