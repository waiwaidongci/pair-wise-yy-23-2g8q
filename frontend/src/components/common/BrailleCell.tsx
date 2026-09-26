import { BRAILLE_DOT_IDS } from "../../utils/braillePattern";

type DotMark = "idle" | "on" | "missing" | "extra";

interface BrailleCellProps {
  /** 当前按下的点位（或只读展示的点阵） */
  selected?: number[];
  /** 该点但未点（少点），提交判定后展示 */
  missing?: number[];
  /** 不该点却点了（多点），提交判定后展示 */
  extra?: number[];
  onToggle?: (dot: number) => void;
  disabled?: boolean;
  ariaLabel?: string;
}

export function BrailleCell({
  selected = [],
  missing = [],
  extra = [],
  onToggle,
  disabled = false,
  ariaLabel = "盲文六点阵"
}: BrailleCellProps) {
  const markOf = (dot: number): DotMark => {
    if (missing.includes(dot)) return "missing";
    if (extra.includes(dot)) return "extra";
    return selected.includes(dot) ? "on" : "idle";
  };

  return (
    <div className="braille-cell" role="group" aria-label={ariaLabel}>
      {BRAILLE_DOT_IDS.map((dot) => {
        const mark = markOf(dot);
        return (
          <button
            key={dot}
            type="button"
            className={`braille-dot ${mark}`}
            disabled={disabled || !onToggle}
            aria-pressed={selected.includes(dot)}
            aria-label={`点位 ${dot}${mark === "missing" ? "（少点）" : mark === "extra" ? "（多点）" : ""}`}
            onClick={() => onToggle?.(dot)}
          >
            {dot}
          </button>
        );
      })}
    </div>
  );
}
