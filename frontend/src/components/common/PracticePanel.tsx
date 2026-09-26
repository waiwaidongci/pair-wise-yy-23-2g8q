import type { ReactNode } from "react";
import { StatusBadge } from "./StatusBadge";

interface PracticePanelProps {
  title: string;
  hint?: string;
  value?: string;
  children?: ReactNode;
}

/** 练习区面板容器：标题 + 状态徽标 + 内容插槽 */
export function PracticePanel({ title, hint, value = "READY", children }: PracticePanelProps) {
  return (
    <section className="panel practice-panel">
      <header className="practice-panel-head">
        <div>
          <h2>{title}</h2>
          {hint ? <p className="panel-hint">{hint}</p> : null}
        </div>
        <StatusBadge value={value} />
      </header>
      {children}
    </section>
  );
}
