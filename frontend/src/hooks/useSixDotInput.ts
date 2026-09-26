import { useCallback, useMemo, useState } from "react";
import { DOT_NUMBERS, formatPattern, type DotNumber } from "../utils/braillePattern";

/**
 * 输入层 hook：只负责六个点位的选中/取消与未提交点阵草稿。
 * 提交判定不在此处；换题时由编排层调用 clear 清空草稿。
 */
export function useSixDotInput() {
  const [dots, setDots] = useState<number[]>([]);

  const toggle = useCallback((dot: DotNumber) => {
    setDots((current) => (current.includes(dot) ? current.filter((item) => item !== dot) : [...current, dot]));
  }, []);

  const clear = useCallback(() => setDots([]), []);

  const pattern = useMemo(() => formatPattern(dots), [dots]);
  const selectedSet = useMemo(() => new Set(dots), [dots]);

  return { dots, selectedSet, pattern, toggle, clear, dotNumbers: DOT_NUMBERS };
}
