import { useEffect, useState } from "react";

/**
 * 输入职责：只维护“当前这一遍”的点位选择，不管判定，也不管保存。
 * resetKey 变化（换题 / 进入第二遍）时清空未提交的点阵。
 */
export function useDotInput(resetKey: string) {
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    setSelected([]);
  }, [resetKey]);

  const toggle = (dot: number) =>
    setSelected((prev) => (prev.includes(dot) ? prev.filter((d) => d !== dot) : [...prev, dot]));

  const clear = () => setSelected([]);

  return { selected, toggle, clear, isEmpty: selected.length === 0 };
}
