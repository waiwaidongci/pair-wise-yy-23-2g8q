import type { DotNumber } from "../../utils/braillePattern";

interface SixDotInputProps {
  selected: ReadonlySet<number>;
  disabled?: boolean;
  /** 该点但未点（提交后红色描边标出） */
  missingDots?: readonly DotNumber[];
  /** 不该点却点了（提交后橙底标出） */
  extraDots?: readonly DotNumber[];
  onToggle: (dot: DotNumber) => void;
}

/** 学员输入用六点方阵，点击切换点位；判定结果以漏点/多点样式标出 */
export function SixDotInput({ selected, disabled = false, missingDots = [], extraDots = [], onToggle }: SixDotInputProps) {
  const missing = new Set(missingDots);
  const extra = new Set(extraDots);
  // 视觉渲染顺序：1 4 / 2 5 / 3 6
  const visualDots: DotNumber[] = [1, 4, 2, 5, 3, 6];

  return (
    <div className="six-dot-input" aria-label="六点输入区">
      <div className={disabled ? "braille-grid locked" : "braille-grid"}>
        {visualDots.map((dot) => {
          const isSelected = selected.has(dot);
          const classes = ["dot", "dot-button"];
          if (isSelected) classes.push("raised");
          if (missing.has(dot)) classes.push("missing");
          if (extra.has(dot)) classes.push("extra");
          return (
            <button
              key={dot}
              type="button"
              className={classes.join(" ")}
              disabled={disabled}
              aria-pressed={isSelected}
              aria-label={`第 ${dot} 点${missing.has(dot) ? "，该点但未点" : ""}${extra.has(dot) ? "，不该点却点了" : ""}`}
              onClick={() => onToggle(dot)}
            />
          );
        })}
      </div>
    </div>
  );
}
