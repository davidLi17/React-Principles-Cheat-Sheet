/**
 * Fiber 树解析工具
 * 将 JSX 字符串解析为 Fiber 节点树结构
 */

export interface FiberNode {
  type: string;
  key?: string;
  props?: Record<string, unknown>;
  children?: FiberNode[];
}

/**
 * 提取子标签（正确处理嵌套）
 */
export const extractChildTags = (content: string): string[] => {
  const results: string[] = [];
  let i = 0;
  let textStart = 0;

  while (i < content.length) {
    if (content[i] === "<") {
      // 保存之前的文本
      if (i > textStart) {
        const text = content.slice(textStart, i).trim();
        if (text) results.push(text);
      }

      // 检查是否是自闭合标签
      const selfCloseMatch = content.slice(i).match(/^<(\w+)[^>]*\/>/);
      if (selfCloseMatch) {
        results.push(selfCloseMatch[0]);
        i += selfCloseMatch[0].length;
        textStart = i;
        continue;
      }

      // 提取标签名
      const tagNameMatch = content.slice(i).match(/^<(\w+)/);
      if (tagNameMatch) {
        const tagName = tagNameMatch[1];
        let depth = 1;
        let j = i + tagNameMatch[0].length;

        // 找到匹配的闭合标签
        while (j < content.length && depth > 0) {
          const openMatch = content
            .slice(j)
            .match(new RegExp(`^<${tagName}(?:\\s|>)`));
          const closeMatch = content
            .slice(j)
            .match(new RegExp(`^</${tagName}>`));
          const selfClose = content.slice(j).match(/^<\w+[^>]*\/>/);

          if (closeMatch) {
            depth--;
            if (depth === 0) {
              results.push(content.slice(i, j + closeMatch[0].length));
              i = j + closeMatch[0].length;
              textStart = i;
              break;
            }
            j += closeMatch[0].length;
          } else if (openMatch) {
            depth++;
            j++;
          } else if (selfClose) {
            j += selfClose[0].length;
          } else {
            j++;
          }
        }

        if (depth > 0) {
          // 没找到闭合标签，跳过
          i++;
          textStart = i;
        }
        continue;
      }
    }
    i++;
  }

  // 保存剩余文本
  if (textStart < content.length) {
    const text = content.slice(textStart).trim();
    if (text) results.push(text);
  }

  return results;
};

/**
 * 解析单个标签
 */
const parseTag = (str: string): FiberNode | null => {
  str = str.trim();

  // 自闭合标签 <input />
  const selfClosingMatch = str.match(/^<(\w+)([^>]*)\s*\/>$/);
  if (selfClosingMatch) {
    const [, type, propsStr] = selfClosingMatch;
    const key = propsStr.match(/key="([^"]+)"/)?.[1];
    return { type, key, children: [] };
  }

  // 普通标签 <div>...</div>
  const match = str.match(/^<(\w+)([^>]*)>([\s\S]*)<\/\1>$/);
  if (!match) return null;

  const [, type, propsStr, content] = match;
  const key = propsStr.match(/key="([^"]+)"/)?.[1];

  // 解析子节点
  const children: FiberNode[] = [];
  const trimmedContent = content.trim();

  if (trimmedContent) {
    const childTags = extractChildTags(trimmedContent);

    for (const childTag of childTags) {
      if (childTag.startsWith("<")) {
        const childNode = parseTag(childTag);
        if (childNode) children.push(childNode);
      } else if (childTag.trim()) {
        // 纯文本节点
        children.push({
          type: "text",
          props: { content: childTag.trim() },
          children: [],
        });
      }
    }
  }

  return { type, key, children };
};

/**
 * 解析 JSX 字符串为 Fiber 树
 */
export const parseJSX = (jsx: string): FiberNode | null => {
  try {
    return parseTag(jsx.trim());
  } catch {
    return null;
  }
};
