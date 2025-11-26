import React from 'react';

export const FiberStructureDiagram: React.FC = () => {
  return (
    <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-2 right-2 text-xs text-slate-500 font-mono">
        Fiber Node Structure
      </div>
      <svg width="100%" height="280" viewBox="0 0 400 240" className="max-w-md">
        <defs>
          <marker
            id="arrow"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="#64748b" />
          </marker>
        </defs>

        {/* Parent Node */}
        <g transform="translate(150, 40)">
          <rect
            x="0"
            y="0"
            width="100"
            height="60"
            rx="8"
            fill="#1e293b"
            stroke="#3b82f6"
            strokeWidth="2"
          />
          <text
            x="50"
            y="25"
            textAnchor="middle"
            fill="#93c5fd"
            fontSize="14"
            fontWeight="bold"
          >
            Parent
          </text>
          <text x="50" y="45" textAnchor="middle" fill="#64748b" fontSize="10">
            Fiber Node
          </text>
        </g>

        {/* Child Node */}
        <g transform="translate(50, 160)">
          <rect
            x="0"
            y="0"
            width="100"
            height="60"
            rx="8"
            fill="#1e293b"
            stroke="#10b981"
            strokeWidth="2"
          />
          <text
            x="50"
            y="25"
            textAnchor="middle"
            fill="#6ee7b7"
            fontSize="14"
            fontWeight="bold"
          >
            Child
          </text>
        </g>

        {/* Sibling Node */}
        <g transform="translate(250, 160)">
          <rect
            x="0"
            y="0"
            width="100"
            height="60"
            rx="8"
            fill="#1e293b"
            stroke="#a855f7"
            strokeWidth="2"
          />
          <text
            x="50"
            y="25"
            textAnchor="middle"
            fill="#d8b4fe"
            fontSize="14"
            fontWeight="bold"
          >
            Sibling
          </text>
        </g>

        {/* Lines */}
        {/* Parent to Child (child pointer) */}
        <path
          d="M 200 100 L 100 155"
          stroke="#10b981"
          strokeWidth="2"
          markerEnd="url(#arrow)"
          strokeDasharray="5,2"
        />
        <text x="130" y="125" fill="#10b981" fontSize="11" fontWeight="bold">
          child
        </text>

        {/* Child to Sibling (sibling pointer) */}
        <path
          d="M 155 190 L 245 190"
          stroke="#a855f7"
          strokeWidth="2"
          markerEnd="url(#arrow)"
        />
        <text
          x="200"
          y="180"
          textAnchor="middle"
          fill="#a855f7"
          fontSize="11"
          fontWeight="bold"
        >
          sibling
        </text>

        {/* Child to Parent (return pointer) */}
        <path
          d="M 80 160 C 60 120, 140 120, 150 105"
          stroke="#3b82f6"
          strokeWidth="2"
          markerEnd="url(#arrow)"
          fill="none"
        />
        <text x="80" y="130" fill="#3b82f6" fontSize="11" fontWeight="bold">
          return
        </text>
      </svg>
      <div className="mt-4 text-slate-600 dark:text-slate-400 text-sm text-center">
        <p>
          Fiber 将递归树变成了
          <span className="text-blue-600 dark:text-blue-400 font-bold">链表</span>。
        </p>
        <p className="text-xs opacity-70">
          任务可以随时中断，下次通过指针找回位置。
        </p>
      </div>
    </div>
  );
};
