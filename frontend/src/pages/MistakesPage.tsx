import { useEffect } from "react";
import { MistakeReasonText } from "../constants/MistakeReason";
import { useAnswerRecordStore } from "../stores/AnswerRecordStore";
import { useBrailleSymbolStore } from "../stores/BrailleSymbolStore";
import { BrailleCell } from "../components/common/BrailleCell";
import { EmptyState } from "../components/common/EmptyState";
import { formatDotsPattern } from "../utils/formatters";

/** 错题本：只展示第二遍仍答错（correct=0）的已提交记录，含两遍答案 */
export function MistakesPage() {
  const { rows: records, load: loadRecords } = useAnswerRecordStore();
  const { rows: symbols, load: loadSymbols } = useBrailleSymbolStore();

  useEffect(() => {
    void loadRecords();
    void loadSymbols();
  }, [loadRecords, loadSymbols]);

  const mistakes = records.filter((record) => record.correct === "0");
  const symbolMap = new Map(symbols.map((symbol) => [symbol.id, symbol]));

  return (
    <main className="page">
      <section className="page-head">
        <div>
          <p className="eyebrow">braille-trainer</p>
          <h1>错题本</h1>
        </div>
        <span className="run-status">共 {mistakes.length} 道错题</span>
      </section>
      <section className="panel wide">
        <h2>两遍作答记录</h2>
        {mistakes.length === 0 ? (
          <EmptyState title="还没有错题，去练习模式试试吧" />
        ) : (
          <div className="mistake-list">
            {mistakes.map((record) => {
              const symbol = symbolMap.get(record.symbol_id);
              return (
                <article key={record.id} className="mistake-row">
                  <div className="mistake-prompt">
                    <strong>{symbol?.letter ?? record.symbol_id}</strong>
                    <span>{symbol?.pinyin ?? ""}</span>
                    <BrailleCell pattern={symbol?.cell_pattern ?? ""} size={56} />
                  </div>
                  <div className="mistake-detail">
                    <span className="badge wrong">
                      {MistakeReasonText[record.mistake_reason as never] ?? record.mistake_reason}
                    </span>
                    <p>第一遍：{formatDotsPattern(record.first_answer)}</p>
                    <p>第二遍：{formatDotsPattern(record.user_answer)}</p>
                    <p className="muted">正确：{formatDotsPattern(symbol?.cell_pattern ?? "")}</p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
