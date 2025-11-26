import { useState, useCallback } from "react";
import type { FiberNode } from "../utils/fiberParser";
import { parseJSX } from "../utils/fiberParser";

export interface UseFiberVisualizerOptions {
  initialJSX?: string;
}

export const useFiberVisualizer = (options?: UseFiberVisualizerOptions) => {
  const [jsxInput, setJsxInput] = useState(options?.initialJSX || "");
  const [fiberTree, setFiberTree] = useState<FiberNode | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const parse = useCallback(() => {
    if (!jsxInput.trim()) {
      setParseError("请输入 JSX 代码");
      return;
    }

    const result = parseJSX(jsxInput);
    if (result) {
      setFiberTree(result);
      setParseError(null);
    } else {
      setParseError("解析失败，请检查 JSX 语法");
    }
  }, [jsxInput]);

  const loadExample = useCallback((jsx: string) => {
    setJsxInput(jsx);
    const result = parseJSX(jsx);
    if (result) {
      setFiberTree(result);
      setParseError(null);
    }
  }, []);

  const clear = useCallback(() => {
    setJsxInput("");
    setFiberTree(null);
    setParseError(null);
  }, []);

  const setInput = useCallback((input: string) => {
    setJsxInput(input);
  }, []);

  return {
    jsxInput,
    setInput,
    fiberTree,
    parseError,
    parse,
    loadExample,
    clear,
  };
};
