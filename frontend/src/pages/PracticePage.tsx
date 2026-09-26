import { useEffect } from "react";
import { useBrailleSymbolStore } from "../stores/BrailleSymbolStore";
import { usePracticeSession } from "../hooks/usePracticeSession";
import { PracticePanel } from "../components/common/PracticePanel";
import { StatCard } from "../components/common/StatCard";
import { EmptyState } from "../components/common/EmptyState";
import { PracticeComposer } from "../components/practice/PracticeComposer";
import { AttemptFeedback } from "../components/practice/AttemptFeedback";

export function PracticePage() {
  const { rows: symbols, load } = useBrailleSymbolStore();
  useEffect(() => {
    void load();
  }, [load]);

  const practice = usePracticeSession(symbols);
  const { symbol, status, judgement, tally } = practice;

  return (
    <main className="page">
      <section className="page-head">
        <div>
          <p className="eyebrow">braille-trainer</p>
          <h1>练习模式 · 看字母点盲文</h1>
          <p className="page-desc">题目显示字母与拼音，点击六个点位组成点阵后提交；提交后标出少点与多点。</p>
        </div>
      </section>

      <section className="metrics">
        <StatCard label="已提交题目" value={tally.answered} />
        <StatCard label="最终答对" value={tally.correctCount} />
        <StatCard label="进入错题本" value={tally.mistakeCount} />
      </section>

      <PracticePanel
        title="TEXT_TO_CELL · 字母转点阵"
        hint="第一遍答错可以再试一次；第二遍无论对错都会保存，仍错则进入错题本。"
      >
        {!symbol ? (
          <EmptyState title="暂无可用题目" />
        ) : (
          <div className="practice-layout">
            <PracticeComposer
              symbol={symbol}
              attempt={practice.attempt}
              selected={practice.selected}
              judgement={status === "RESOLVED" ? judgement : null}
              locked={status !== "ANSWERING"}
              submitting={practice.submitting}
              error={practice.error}
              onToggle={practice.toggleDot}
              onSubmit={() => void practice.submit()}
            />
            {status !== "ANSWERING" && judgement ? (
              <AttemptFeedback
                judgement={judgement}
                attempt={practice.attempt}
                canRetry={status === "RETRY"}
                onNext={practice.next}
              />
            ) : null}
          </div>
        )}
      </PracticePanel>
    </main>
  );
}
