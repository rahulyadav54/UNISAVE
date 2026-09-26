"use client";

import { useCallback, useEffect, useState } from "react";

export interface HistoryItem {
  id: string;
  title: string;
  platform: string;
  format: string;
  thumbnail?: string;
  date: string;
}

const STORAGE_KEY = "unisave:download-history";

export function useDownloadHistory() {
  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as HistoryItem[]);
    } catch {
      setItems([]);
    }
  }, []);

  const addItem = useCallback((item: Omit<HistoryItem, "id" | "date">) => {
    setItems((prev) => {
      const next = [
        {
          ...item,
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
        },
        ...prev,
      ].slice(0, 20);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setItems([]);
  }, []);

  return { items, addItem, clear };
}
