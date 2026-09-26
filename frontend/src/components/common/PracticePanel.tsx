import type { ReactNode } from "react";

interface PracticePanelProps {
  title: string;
  hint?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function PracticePanel({ title, hint, children, footer }: PracticePanelProps) {
  return (
    <section className="panel practice-panel">
      <header className="practice-panel-head">
        <h2>{title}</h2>
        {hint ? <p>{hint}</p> : null}
      </header>
      <div className="practice-panel-body">{children}</div>
      {footer ? <footer className="practice-panel-foot">{footer}</footer> : null}
    </section>
  );
}
