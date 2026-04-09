import { useEffect, useRef } from 'react';
import { useExamStore } from '@/store/examStore';
import type { ExamProject } from '@/lib/types';

export function useAutoSave() {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    // Zustand persist middleware already saves to localStorage on every change.
    // This hook is for Tauri file-based autosave (AppData/autosave.json).
    const unsubscribe = useExamStore.subscribe(() => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(async () => {
        try {
          const { writeTextFile, BaseDirectory } = await import('@tauri-apps/plugin-fs');
          const project = useExamStore.getState().exportProject();
          await writeTextFile('autosave.json', JSON.stringify(project), { baseDir: BaseDirectory.AppData });
        } catch {
          // Not in Tauri context, localStorage persist handles it
        }
      }, 2000);
    });
    return () => {
      unsubscribe();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
}

export async function loadAutoSave(): Promise<ExamProject | null> {
  try {
    const { readTextFile, exists, BaseDirectory } = await import('@tauri-apps/plugin-fs');
    const fileExists = await exists('autosave.json', { baseDir: BaseDirectory.AppData });
    if (!fileExists) return null;
    const content = await readTextFile('autosave.json', { baseDir: BaseDirectory.AppData });
    return JSON.parse(content) as ExamProject;
  } catch {
    return null;
  }
}
