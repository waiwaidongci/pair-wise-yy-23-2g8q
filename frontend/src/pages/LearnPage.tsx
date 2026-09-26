import { useEffect } from "react";
import { useBrailleSymbolStore } from "../stores/BrailleSymbolStore";
import { parseCellPattern } from "../utils/braillePattern";
import { BrailleCell } from "../components/common/BrailleCell";
import { EmptyState } from "../components/common/EmptyState";

export function LearnPage() {
  const { rows, load } = useBrailleSymbolStore();

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <main className="page">
      <section className="page-head">
        <div>
          <p className="eyebrow">braille-trainer</p>
          <h1>学习卡片</h1>
          <p className="page-desc">先看字母、拼音与对应点阵，再去练习页自己点。</p>
        </div>
      </section>

      {rows.length === 0 ? (
        <EmptyState title="暂无字符卡片" />
      ) : (
        <section className="card-grid">
          {rows.map((symbol) => (
            <article className="panel symbol-card" key={symbol.id}>
              <header>
                <strong className="prompt-letter">{symbol.letter}</strong>
                <span className="prompt-pinyin">{symbol.pinyin}</span>
              </header>
              <BrailleCell selected={parseCellPattern(symbol.cell_pattern)} disabled ariaLabel={`${symbol.letter} 的点阵`} />
              <footer>点位：{symbol.cell_pattern}</footer>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
