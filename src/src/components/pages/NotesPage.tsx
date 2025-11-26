import React, { useState } from 'react';
import { ContentCard } from '../ui/ContentCard';
import { useNotes } from '../../hooks/useNotes';
import { TrashIcon, EditIcon, FileTextIcon } from '../icons';
import { pageLabels } from '../../data';

interface NotesPageProps {
  currentPage: string;
}

export const NotesPage: React.FC<NotesPageProps> = ({ currentPage }) => {
  const { notes, addNote, updateNote, deleteNote } = useNotes();
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [filterPage, setFilterPage] = useState<string>('all');

  const handleAddNote = () => {
    if (newNoteContent.trim()) {
      addNote(newNoteContent.trim(), currentPage);
      setNewNoteContent('');
    }
  };

  const handleStartEdit = (id: string, content: string) => {
    setEditingId(id);
    setEditContent(content);
  };

  const handleSaveEdit = (id: string) => {
    if (editContent.trim()) {
      updateNote(id, editContent.trim());
    }
    setEditingId(null);
    setEditContent('');
  };

  const filteredNotes = filterPage === 'all' 
    ? notes 
    : notes.filter(n => n.pageId === filterPage);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ContentCard title="我的笔记">
      <div className="space-y-6">
        {/* 添加新笔记 */}
        <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <h3 className="text-slate-700 dark:text-slate-300 font-medium mb-3 flex items-center gap-2">
            <FileTextIcon size={16} />
            添加新笔记
            <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
              (将保存到当前页面: {pageLabels[currentPage] || currentPage})
            </span>
          </h3>
          <textarea
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="记录你的学习心得..."
            className="w-full h-24 p-3 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleAddNote}
              disabled={!newNoteContent.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
            >
              保存笔记
            </button>
          </div>
        </div>

        {/* 筛选 */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">筛选:</span>
          <select
            value={filterPage}
            onChange={(e) => setFilterPage(e.target.value)}
            className="text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全部笔记 ({notes.length})</option>
            {Object.entries(pageLabels).map(([id, label]) => {
              const count = notes.filter(n => n.pageId === id).length;
              if (count === 0) return null;
              return (
                <option key={id} value={id}>
                  {label} ({count})
                </option>
              );
            })}
          </select>
        </div>

        {/* 笔记列表 */}
        <div className="space-y-3">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <FileTextIcon size={48} className="mx-auto mb-4 opacity-30" />
              <p>还没有笔记</p>
              <p className="text-sm">开始记录你的学习心得吧！</p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4"
              >
                {editingId === note.id ? (
                  // 编辑模式
                  <div>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full h-24 p-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      autoFocus
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                      >
                        取消
                      </button>
                      <button
                        onClick={() => handleSaveEdit(note.id)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded"
                      >
                        保存
                      </button>
                    </div>
                  </div>
                ) : (
                  // 显示模式
                  <>
                    <p className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap">
                      {note.content}
                    </p>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">
                          {pageLabels[note.pageId] || note.pageId}
                        </span>
                        <span>{formatDate(note.updatedAt)}</span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleStartEdit(note.id, note.content)}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-blue-500 transition-colors"
                          title="编辑"
                        >
                          <EditIcon size={14} />
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-red-500 transition-colors"
                          title="删除"
                        >
                          <TrashIcon size={14} />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </ContentCard>
  );
};
