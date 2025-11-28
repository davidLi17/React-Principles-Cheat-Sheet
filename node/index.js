/*
 * @Author: lihaoge lihaoge@bytedance.com
 * @Date: 2025-11-27
 * @Description:
 */
import { isEmpty, isNil } from "lodash";
console.log("🔍LHG:node/index.js isNil:::", isNil);
console.log("🔍LHG:node/index.js isEmpty:::", isEmpty);

function testIsEmpty() {
  const testValues = [
    null,
    undefined,
    false,
    0,
    "0",
    NaN,
    "",
    [],
    {},
    new Map(),
    new Set(),
    [1, 2, 3],
    "hello",
    { a: 1 },
    new Map([["a", 1]]),
    new Set([1, 2]),
    true,
    42,
  ];

  testValues.forEach((value) => {
    console.log(`调用isEmpty(${JSON.stringify(value)}) → ${isEmpty(value)}`);
  });
}

function testIsNil() {
  const testValues = [null, undefined];

  testValues.forEach((value) => {
    console.log(`调用isNil(${JSON.stringify(value)}) → ${isNil(value)}`);
  });
}

// 调用测试函数
console.log("=== 测试 isEmpty 函数 ===");
testIsEmpty();

console.log("\n=== 测试 isNil 函数 ===");
testIsNil();
