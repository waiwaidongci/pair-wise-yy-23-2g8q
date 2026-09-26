import { useEffect } from "react";
import { useBrailleSymbolStore } from "../stores/BrailleSymbolStore";
import { useAnswerRecordStore } from "../stores/AnswerRecordStore";
import { MISTAKE_REASON_TEXT, type MistakeReason } from "../constants/mistakeReasons";
import { decodeUserAnswer } from "../utils/answerEncoding";
import { BrailleCell } from "../components/common/BrailleCell";
import { EmptyState } from "../components/common/EmptyState";
import { ResultBadge } from "../components/common/ResultBadge";

/** 错题本：只展示已提交且最终答错的记录，两遍答案按 “第一遍|第二遍” 还原 */
export function MistakesPage() {
  const symbols = useBrailleSymbolStore();
  const records = useAnswerRecordStore();

  useEffect(() => {
    void symbols.load();
    void records.load();
  }, [symbols.load, records.load]);

  const mistakes = records.rows.filter((row) => !row.correct);
  const symbolOf = (id: number) => symbols.rows.find((row) => row.id === id);
  const byReason = mistakes.reduce<Record<string, typeof mistakes>>((acc, row) => {
    (acc[row.mistake_reason] ??= []).push(row);
    return acc;
  }, {});

  return (
    <main className="page">
      <section className="page-head">
        <div>
          <p className="eyebrow">braille-trainer</p>
          <h1>错题本</h1>
          <p className="page-desc">只收录已提交且最终答错的题目；两遍答案一并保存，按错误原因归类。</p>
        </div>
      </section>

      {mistakes.length === 0 ? (
        <EmptyState title="暂无错题，继续保持" />
      ) : (
        Object.entries(byReason).map(([reason, rows]) => (
          <section className="panel" key={reason}>
            <h2>{MISTAKE_REASON_TEXT[reason as MistakeReason] ?? reason}（{rows.length} 题）</h2>
            <div className="mistake-list">
              {rows.map((row) => {
                const symbol = symbolOf(row.symbol_id);
                const attempts = decodeUserAnswer(row.user_answer);
                return (
                  <article className="mistake-item" key={row.id}>
                    <header>
                      <strong>{symbol ? `${symbol.letter} · ${symbol.pinyin}` : `符号 #${row.symbol_id}`}</strong>
                      <ResultBadge tone="WRONG" />
                    </header>
                    <div className="mistake-attempts">
                      {attempts.map((dots, idx) => (
                        <div className="mistake-attempt" key={idx}>
                          <span>第 {idx + 1} 遍</span>
                          <BrailleCell selected={dots} disabled ariaLabel={`第 ${idx + 1} 遍作答`} />
                        </div>
                      ))}
                      {symbol ? (
                        <div className="mistake-attempt">
                          <span>正确点阵</span>
                          <BrailleCell
                            selected={symbol.cell_pattern.split("-").map(Number)}
                            disabled
                            ariaLabel="正确点阵"
                          />
                        </div>
                      ) : null}
                    </div>
                    <footer>耗时 {row.latency_ms} ms · 记录 #{row.id}</footer>
                  </article>
                );
              })}
            </div>
          </section>
        ))
      )}
    </main>
  );
}
