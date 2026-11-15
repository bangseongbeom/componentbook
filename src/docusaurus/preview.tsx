import { Component, type ReactNode } from "react";

/** Renders a component preview, showing the error instead if it throws on the client. */
export function ComponentbookPreview({ children }: { children: ReactNode }): ReactNode {
  return (
    <div className="componentbook-preview">
      <PreviewErrorBoundary>{children}</PreviewErrorBoundary>
    </div>
  );
}

class PreviewErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  override state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: unknown): { error: Error } {
    return { error: error instanceof Error ? error : new Error(String(error)) };
  }

  override render(): ReactNode {
    if (this.state.error)
      return (
        <p className="componentbook-preview__error">
          Preview unavailable: {this.state.error.message}
        </p>
      );
    return this.props.children;
  }
}
