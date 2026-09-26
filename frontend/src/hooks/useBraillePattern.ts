import { useMemo } from "react";
import { classifyMistake, judgePattern } from "../utils/braillePattern";

/**
 * 判定层 hook：对一次提交的点阵给出对错、漏点、多点与错题归类。
 * 纯派生状态，不保存记录；记录保存由记录层（api/store）承担。
 */
export function useBraillePattern(answer: string, target: string) {
  return useMemo(() => {
    const judgement = judgePattern(answer, target);
    return {
      ...judgement,
      mistakeReason: classifyMistake(judgement)
    };
  }, [answer, target]);
}
