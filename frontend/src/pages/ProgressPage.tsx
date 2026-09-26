import { useEffect } from "react";
import { useAnswerRecordStore } from "../stores/AnswerRecordStore";
import { usePracticeSessionStore } from "../stores/PracticeSessionStore";
import { StatCard } from "../components/common/StatCard";
import { EmptyState } from "../components/common/EmptyState";
import { ResultBadge } from "../components/common/ResultBadge";

/** 学习进度：统计只认已提交（已持久化）的答题记录 */
export function ProgressPage() {
  const records = useAnswerRecordStore();
  const sessions = usePracticeSessionStore();

  useEffect(() => {
    void records.load();
    void sessions.load();
  }, [records.load, sessions.load]);

  const total = records.rows.length;
  const correct = records.rows.filter((row) => row.correct).length;
  const accuracy = total ? Math.round((correct / total) * 100) : 0;
  const recent = [...records.rows].slice(-8).reverse();

  return (
    <main className="page">
      <section className="page-head">
        <div>
          <p className="eyebrow">braille-trainer</p>
          <h1>学习进度</h1>
          <p className="page-desc">统计仅来自已提交的答题记录；未提交的点阵与中途离开不计入。</p>
        </div>
      </section>

      <section className="metrics">
        <StatCard label="已提交记录" value={total} />
        <StatCard label="正确率" value={`${accuracy}%`} />
        <StatCard label="练习会话" value={sessions.rows.length} />
      </section>

      <section className="panel">
        <h2>最近提交</h2>
        {recent.length === 0 ? (
          <EmptyState title="还没有已提交的答题记录" />
        ) : (
          <div className="table">
            {recent.map((row) => (
              <article className="row" key={row.id}>
                <strong>符号 #{row.symbol_id} · 会话 #{row.session_id}</strong>
                <span>{row.latency_ms} ms</span>
                <ResultBadge tone={row.correct ? "CORRECT" : "WRONG"} />
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
