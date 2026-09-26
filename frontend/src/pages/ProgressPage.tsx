import { useEffect } from "react";
import { usePracticeSessionStore } from "../stores/PracticeSessionStore";
import { EmptyState } from "../components/common/EmptyState";
import { formatDate } from "../utils/formatters";

/** 学习进度：会话统计只来自离开练习页时保存的已提交记录汇总 */
export function ProgressPage() {
  const { rows: sessions, load } = usePracticeSessionStore();

  useEffect(() => {
    void load();
  }, [load]);

  const totalSubmitted = sessions.reduce((sum, session) => sum + session.submitted_count, 0);
  const totalMistakes = sessions.reduce((sum, session) => sum + session.mistake_count, 0);

  return (
    <main className="page">
      <section className="page-head">
        <div>
          <p className="eyebrow">braille-trainer</p>
          <h1>学习进度</h1>
        </div>
        <span className="run-status">共 {sessions.length} 次练习会话</span>
      </section>
      <section className="metrics">
        <div className="stat"><span>会话数</span><strong>{sessions.length}</strong></div>
        <div className="stat"><span>累计已提交题数</span><strong>{totalSubmitted}</strong></div>
        <div className="stat"><span>累计错题数</span><strong>{totalMistakes}</strong></div>
      </section>
      <section className="panel wide">
        <h2>会话记录</h2>
        {sessions.length === 0 ? (
          <EmptyState title="完成一次练习并离开后，这里才会出现统计" />
        ) : (
          <div className="table">
            {sessions.map((session) => (
              <article key={session.id} className="row">
                <strong>会话 #{session.id}</strong>
                <span>{formatDate(session.started_at)} - {formatDate(session.finished_at)}</span>
                <span className="badge">{session.mode}</span>
                <span>已提交 {session.submitted_count} 题 · 正确率 {session.score}% · 错题 {session.mistake_count}</span>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
