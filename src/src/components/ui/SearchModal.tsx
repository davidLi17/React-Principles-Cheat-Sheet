import React, { useState, useEffect, useCallback } from 'react';
import { SearchIcon, XIcon } from '../icons';
import { searchableItems, pageLabels } from '../../data';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (pageId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(searchableItems.slice(0, 8));

  // 搜索逻辑
  useEffect(() => {
    if (!query.trim()) {
      setResults(searchableItems.slice(0, 8));
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = searchableItems.filter(
      item =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.content.toLowerCase().includes(lowerQuery)
    );
    setResults(filtered.slice(0, 10));
  }, [query]);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (!isOpen) {
          // 父组件控制打开
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSelect = useCallback((pageId: string | undefined) => {
    if (pageId) {
      onNavigate(pageId);
      onClose();
      setQuery('');
    }
  }, [onNavigate, onClose]);

  if (!isOpen) return null;

  const typeColors = {
    concept: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    interview: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    page: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  };

  const typeLabels = {
    concept: '概念',
    interview: '面试题',
    page: '页面',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 搜索框 */}
      <div className="relative w-full max-w-xl mx-4 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* 输入框 */}
        <div className="flex items-center px-4 border-b border-slate-200 dark:border-slate-700">
          <SearchIcon size={20} className="text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索概念、面试题、页面... (⌘K)"
            className="flex-1 px-3 py-4 bg-transparent text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
          >
            <XIcon size={18} className="text-slate-400" />
          </button>
        </div>

        {/* 搜索结果 */}
        <div className="max-h-[60vh] overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              没有找到相关结果
            </div>
          ) : (
            <ul className="py-2">
              {results.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleSelect(item.page)}
                    className="w-full px-4 py-3 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors"
                  >
                    <span
                      className={`shrink-0 text-[10px] px-2 py-0.5 rounded ${typeColors[item.type]}`}
                    >
                      {typeLabels[item.type]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-800 dark:text-slate-200 truncate">
                        {item.title}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {item.content}
                      </div>
                      {item.page && (
                        <div className="text-xs text-slate-400 mt-1">
                          → {pageLabels[item.page]}
                        </div>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 快捷键提示 */}
        <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-700 flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">↵</kbd>
            选择
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">Esc</kbd>
            关闭
          </span>
        </div>
      </div>
    </div>
  );
};
