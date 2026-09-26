import { MISTAKE_REASON_TEXT } from "../../constants/mistakeReasons";
import { ResultBadge, type ResultTone } from "../common/ResultBadge";
import type { DotJudgement } from "../../types/DotJudgement";
import { mistakeReasonOf } from "../../services/judgeBrailleAnswer";

interface AttemptFeedbackProps {
  judgement: DotJudgement;
  /** 当前是第几遍后的反馈 */
  attempt: 1 | 2;
  /** 是否还能再来一遍（仅第一遍错时为 true） */
  canRetry: boolean;
  onNext: () => void;
}

/** 判定反馈：同时标出少点和多点；第二遍结束后给出“下一题” */
export function AttemptFeedback({ judgement, attempt, canRetry, onNext }: AttemptFeedbackProps) {
  const tone: ResultTone = judgement.correct ? "CORRECT" : canRetry ? "RETRY" : "WRONG";
  const reason = mistakeReasonOf(judgement);

  return (
    <div className="attempt-feedback" role="status">
      <ResultBadge tone={tone} />
      <ul className="dot-diff">
        <li className={judgement.missing.length ? "diff-missing" : "diff-ok"}>
          该点但未点（少点）：{judgement.missing.length ? judgement.missing.join("、") : "无"}
        </li>
        <li className={judgement.extra.length ? "diff-extra" : "diff-ok"}>
          不该点却点了（多点）：{judgement.extra.length ? judgement.extra.join("、") : "无"}
        </li>
      </ul>
      {!judgement.correct ? <p className="diff-reason">归类：{MISTAKE_REASON_TEXT[reason]}</p> : null}
      {attempt === 2 && !judgement.correct ? (
        <p className="diff-saved">两遍答案均已保存，本题已进入错题本。</p>
      ) : null}
      {canRetry ? (
        <p className="diff-retry">第一遍答错，已清空点阵，可以再试一次。</p>
      ) : (
        <button type="button" className="primary-btn" onClick={onNext}>
          下一题
        </button>
      )}
    </div>
  );
}
