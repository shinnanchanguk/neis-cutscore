// Wrapper around Tauri file system APIs with browser fallback
import type { ExamProject } from '@/lib/types';

export async function saveProjectAs(project: ExamProject): Promise<string | null> {
  // Try Tauri dialog + fs
  // If not available (browser), use download via Blob
  try {
    const { save } = await import('@tauri-apps/plugin-dialog');
    const { writeTextFile } = await import('@tauri-apps/plugin-fs');
    const path = await save({
      filters: [{ name: 'NEIS Cut Score', extensions: ['neiscut'] }],
      defaultPath: `${project.meta.examName || 'untitled'}.neiscut`,
    });
    if (!path) return null;
    await writeTextFile(path, JSON.stringify(project, null, 2));
    addToRecentFiles(path);
    return path;
  } catch {
    // Browser fallback: download as file
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.meta.examName || 'untitled'}.neiscut`;
    a.click();
    URL.revokeObjectURL(url);
    return null;
  }
}

export async function saveProjectToPath(path: string, project: ExamProject): Promise<boolean> {
  try {
    const { writeTextFile } = await import('@tauri-apps/plugin-fs');
    await writeTextFile(path, JSON.stringify(project, null, 2));
    return true;
  } catch {
    return false;
  }
}

export async function openProject(): Promise<ExamProject | null> {
  try {
    const { open } = await import('@tauri-apps/plugin-dialog');
    const { readTextFile } = await import('@tauri-apps/plugin-fs');
    const path = await open({
      filters: [{ name: 'NEIS Cut Score', extensions: ['neiscut'] }],
      multiple: false,
    });
    if (!path) return null;
    const content = await readTextFile(path as string);
    const project = JSON.parse(content) as ExamProject;
    addToRecentFiles(path as string);
    return project;
  } catch {
    // Browser fallback: file input
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.neiscut';
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) { resolve(null); return; }
        const text = await file.text();
        try { resolve(JSON.parse(text) as ExamProject); } catch { resolve(null); }
      };
      input.click();
    });
  }
}

export async function openProjectFromPath(path: string): Promise<ExamProject | null> {
  try {
    const { readTextFile } = await import('@tauri-apps/plugin-fs');
    const content = await readTextFile(path);
    const project = JSON.parse(content) as ExamProject;
    addToRecentFiles(path);
    return project;
  } catch {
    return null;
  }
}

// Recent files stored in localStorage
export function addToRecentFiles(path: string): void {
  const key = 'neis-recent-files';
  const existing: string[] = JSON.parse(localStorage.getItem(key) || '[]');
  const updated = [path, ...existing.filter(p => p !== path)].slice(0, 10);
  localStorage.setItem(key, JSON.stringify(updated));
}

export function getRecentFiles(): string[] {
  return JSON.parse(localStorage.getItem('neis-recent-files') || '[]');
}

export function clearRecentFiles(): void {
  localStorage.removeItem('neis-recent-files');
}
