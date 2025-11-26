import { useState, useEffect, useCallback } from "react";

export interface Note {
  id: string;
  content: string;
  pageId: string;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = "react-internals-notes";

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 保存到 localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  // 添加笔记
  const addNote = useCallback((content: string, pageId: string) => {
    const newNote: Note = {
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content,
      pageId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes((prev) => [newNote, ...prev]);
    return newNote;
  }, []);

  // 更新笔记
  const updateNote = useCallback((id: string, content: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, content, updatedAt: Date.now() } : note
      )
    );
  }, []);

  // 删除笔记
  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  }, []);

  // 获取某页面的笔记
  const getNotesByPage = useCallback(
    (pageId: string) => {
      return notes.filter((note) => note.pageId === pageId);
    },
    [notes]
  );

  // 搜索笔记
  const searchNotes = useCallback(
    (query: string) => {
      const lowerQuery = query.toLowerCase();
      return notes.filter((note) =>
        note.content.toLowerCase().includes(lowerQuery)
      );
    },
    [notes]
  );

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
    getNotesByPage,
    searchNotes,
  };
};
