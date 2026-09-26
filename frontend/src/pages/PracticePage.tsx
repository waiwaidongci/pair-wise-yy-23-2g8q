import { useEffect } from "react";
import { FINAL_ATTEMPT, FIRST_ATTEMPT, MistakeReasonText } from "../constants/MistakeReason";
import { useBrailleSymbolStore } from "../stores/BrailleSymbolStore";
import { useBraillePattern } from "../hooks/useBraillePattern";
import { useSixDotInput } from "../hooks/useSixDotInput";
import { usePracticeRun } from "../hooks/usePracticeRun";
import { BrailleCell } from "../components/common/BrailleCell";
import { PracticePanel } from "../components/common/PracticePanel";
import { ResultBadge } from "../components/common/ResultBadge";
import { SixDotInput } from "../components/practice/SixDotInput";
import { formatDotsPattern } from "../utils/formatters";

function JudgeLegend() {
  return (
    <p className="judge-legend">
      <i className="legend-dot missing" /> 该点但未点（漏点）
      <i className="legend-dot extra" /> 不该点却点了（多点）
    </p>
  );
}

function phaseBadge(phase: string, attempt: number): string {
  if (phase === "first_review") return "RETRY";
  if (phase === "done") return "SUBMITTED";
  return attempt === FIRST_ATTEMPT ? "INPUTTING" : "RETRY";
}

export function PracticePage() {
  const { rows: symbols, loading, load } = useBrailleSymbolStore();
  useEffect(() => {
    void load();
  }, [load]);

  const run = usePracticeRun(symbols);
  const input = useSixDotInput();
  // 判定层：对最近一次提交的点阵给出漏点/多点（未提交时不产生标记）
  const judged = useBraillePattern(run.feedback?.answer ?? "", run.current?.cell_pattern ?? "");

  if (loading || symbols.length === 0) {
    return <section className="page"><p>正在加载练习题…</p></section>;
  }

  if (run.finished) {
    return (
      <main className="page">
        <section className="page-head">
          <div>
            <p className="eyebrow">braille-trainer</p>
            <h1>练习结束</h1>
          </div>
        </section>
        <section className="metrics">
          <div className="stat"><span>已提交题目</span><strong>{run.stats.submittedCount}</strong></div>
          <div className="stat"><span>答对（第二遍）</span><strong>{run.stats.correctCount}</strong></div>
          <div className="stat"><span>正确率</span><strong>{run.stats.accuracy}%</strong></div>
        </section>
        <PracticePanel title="本次统计只包含已提交记录" value="FINISHED">
          <p>进入错题本的题目为 {run.stats.mistakeCount} 道（第二遍仍答错，含两遍答案）。</p>
        </PracticePanel>
      </main>
    );
  }

  const symbol = run.current;
  const feedback = run.feedback;
  const showMarks = feedback !== null && run.phase !== "answering";
  const isLastQuestion = run.index + 1 >= run.total;

  const handleSubmit = async () => {
    await run.submit(input.pattern);
  };

  const handleRetry = () => {
    // 再试一次：清空第一遍点阵，重新输入第二遍
    input.clear();
    run.retryReset();
  };

  const handleNext = () => {
    // 换题清掉未提交点阵（含跳过与第二遍作答中的草稿）
    input.clear();
    run.goNext();
  };

  return (
    <main className="page">
      <section className="page-head">
        <div>
          <p className="eyebrow">braille-trainer · 看字母拼音拼六点</p>
          <h1>练习模式</h1>
        </div>
        <StatusText submittedCount={run.stats.submittedCount} mistakeCount={run.stats.mistakeCount} />
      </section>

      <PracticePanel
        title={`第 ${run.index + 1} / ${run.total} 题 · 第 ${run.attempt} 遍`}
        hint="题目只显示字母与拼音，点击六个位置组成盲文点阵后提交"
        value={phaseBadge(run.phase, run.attempt)}
      >
        <div className="practice-layout">
          <div className="prompt-card">
            <span className="prompt-letter">{symbol.letter}</span>
            <span className="prompt-pinyin">{symbol.pinyin}</span>
            <BrailleCell
              pattern={run.finalReviewed ? symbol.cell_pattern : ""}
              size={64}
              title={run.finalReviewed ? "正确点阵" : "作答前不展示目标点阵"}
            />
          </div>

          <div className="entry-card">
            <SixDotInput
              selected={input.selectedSet}
              disabled={run.locked}
              missingDots={showMarks ? judged.missingDots : []}
              extraDots={showMarks ? judged.extraDots : []}
              onToggle={input.toggle}
            />
            <JudgeLegend />
            <div className="entry-actions">
              {run.phase === "answering" && (
                <>
                  <button type="button" className="action primary" onClick={handleSubmit}>
                    {run.attempt === FINAL_ATTEMPT ? "提交第二遍" : "提交点阵"}
                  </button>
                  <button type="button" className="action" onClick={input.clear}>
                    清空点阵
                  </button>
                </>
              )}
              {run.phase === "first_review" && (
                <button type="button" className="action primary" onClick={handleRetry}>
                  再试一次（清空后作答第二遍）
                </button>
              )}
              {run.phase === "done" && (
                <button type="button" className="action primary" onClick={handleNext}>
                  {isLastQuestion ? "查看统计" : "换一题"}
                </button>
              )}
            </div>
            {run.phase === "answering" && (
              <button type="button" className="action ghost" onClick={handleNext}>
                跳过并换题（当前点阵不提交）
              </button>
            )}
          </div>

          <div className="feedback-card">
            <h3>提交反馈</h3>
            {feedback === null ? (
              <p className="muted">尚未提交。提交后会同时标出“该点但未点”和“不该点却点了”的点位。</p>
            ) : (
              <div className="feedback-body">
                <ResultBadge correct={judged.correct} />
                {run.firstWrongReview && (
                  <p className="retry-tip">
                    第一遍答错，本遍不保存。点击“再试一次”重新作答；第二遍结果无论对错都会保存。
                  </p>
                )}
                {run.finalReviewed && !judged.correct && (
                  <p className="mistake-reason">
                    错题归类：{MistakeReasonText[feedback.mistakeReason as never] ?? feedback.mistakeReason}，两遍答案已送进错题本。
                    <br />
                    第一遍：{formatDotsPattern(feedback.firstAnswer)} ｜ 第二遍：{formatDotsPattern(feedback.answer)}
                    <br />
                    正确：{formatDotsPattern(symbol.cell_pattern)}
                  </p>
                )}
                {run.finalReviewed && judged.correct && (
                  <p className="correct-tip">
                    {run.attempt === FIRST_ATTEMPT ? "第一遍即答对" : "第二遍答对"}，本次结果已保存。
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </PracticePanel>
    </main>
  );
}

function StatusText({ submittedCount, mistakeCount }: { submittedCount: number; mistakeCount: number }) {
  return (
    <div className="run-status">
      <span>已提交 {submittedCount} 题</span>
      <span>错题 {mistakeCount}</span>
    </div>
  );
}
