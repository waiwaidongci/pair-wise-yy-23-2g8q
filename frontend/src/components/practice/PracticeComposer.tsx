import { BrailleCell } from "../common/BrailleCell";
import type { BrailleSymbol } from "../../types/BrailleSymbol";
import type { DotJudgement } from "../../types/DotJudgement";

interface PracticeComposerProps {
  symbol: BrailleSymbol;
  attempt: 1 | 2;
  selected: number[];
  judgement: DotJudgement | null;
  locked: boolean;
  submitting: boolean;
  error: string | null;
  onToggle: (dot: number) => void;
  onSubmit: () => void;
}

/** 题目 + 六点输入 + 提交，只负责输入，不做判定与保存 */
export function PracticeComposer({
  symbol,
  attempt,
  selected,
  judgement,
  locked,
  submitting,
  error,
  onToggle,
  onSubmit
}: PracticeComposerProps) {
  return (
    <div className="practice-composer">
      <div className="practice-prompt">
        <span className="prompt-letter">{symbol.letter}</span>
        <span className="prompt-pinyin">{symbol.pinyin}</span>
        <span className="prompt-attempt">第 {attempt} 遍</span>
      </div>
      <BrailleCell
        selected={selected}
        missing={judgement?.missing ?? []}
        extra={judgement?.extra ?? []}
        onToggle={locked ? undefined : onToggle}
        disabled={locked}
      />
      <div className="practice-actions">
        <button type="button" className="primary-btn" disabled={locked || submitting} onClick={onSubmit}>
          {submitting ? "判定中…" : "提交点阵"}
        </button>
      </div>
      {error ? <p className="practice-error" role="alert">{error}</p> : null}
    </div>
  );
}
