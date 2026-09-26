import { parsePattern, type DotNumber } from "../../utils/braillePattern";

interface BrailleCellProps {
  /** 凸起点位字符串，如 "1-3-5" */
  pattern?: string;
  size?: number;
  title?: string;
  /** 兼容旧占位调用 */
  value?: string;
}

/** 只读盲文方：左列点位 1/2/3，右列 4/5/6 */
export function BrailleCell({ pattern = "", size = 72, title, value }: BrailleCellProps) {
  const raised = new Set<DotNumber>(value ? parsePattern(value) : parsePattern(pattern));
  // 视觉渲染顺序：1 4 / 2 5 / 3 6
  const visualDots: DotNumber[] = [1, 4, 2, 5, 3, 6];
  return (
    <div className="braille-cell" role="img" aria-label={title ?? `盲文方 ${pattern}`} title={title}>
      <div className="braille-grid" style={{ width: size * 0.82, height: size }}>
        {visualDots.map((dot) => (
          <span key={dot} className={raised.has(dot) ? "dot raised" : "dot"} data-dot={dot} />
        ))}
      </div>
    </div>
  );
}
