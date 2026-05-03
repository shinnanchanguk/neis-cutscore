import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { ExamProject } from '@/lib/types';

const sampleProject: ExamProject = {
  meta: {
    school: '테스트고등학교',
    subject: '수학',
    gradeLevel: '2학년 1학기',
    examName: '2026 중간고사',
  },
  items: [
    { id: 'q1', label: '1번', score: 4, difficulty: '중', isObjective: true },
    { id: 'q2', label: '2번', score: 5, difficulty: '상', isObjective: false },
  ],
  targetDistribution: { A: 30, B: 40, C: 20, D: 7, E: 3 },
  presetName: '일반고',
  settings: {
    includeE미도달: true,
    expectedUnmetRate: 0.05,
    darkMode: 'light',
    onboardingCompleted: true,
    mode: 'simple',
  },
  createdAt: '2026-05-03T00:00:00.000Z',
  updatedAt: '2026-05-03T00:00:00.000Z',
  version: '1.0.0',
} as unknown as ExamProject;

const writeTextFileSpy = vi.fn(async (_path: string, _content: string) => undefined);
const readTextFileSpy = vi.fn(async (_path: string) => JSON.stringify(sampleProject));
const saveDialogSpy = vi.fn(async (_opts: unknown) => '/home/user/Documents/test.neiscut');
const openDialogSpy = vi.fn(async (_opts: unknown) => '/home/user/Documents/test.neiscut');

vi.mock('@tauri-apps/plugin-fs', () => ({
  writeTextFile: (path: string, content: string) => writeTextFileSpy(path, content),
  readTextFile: (path: string) => readTextFileSpy(path),
}));

vi.mock('@tauri-apps/plugin-dialog', () => ({
  save: (opts: unknown) => saveDialogSpy(opts),
  open: (opts: unknown) => openDialogSpy(opts),
}));

function enableTauri() {
  Object.defineProperty(window, '__TAURI_INTERNALS__', {
    value: { plugins: {} },
    configurable: true,
    writable: true,
  });
}

function disableTauri() {
  delete (window as unknown as { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__;
}

describe('storage.ts (Tauri env)', () => {
  beforeEach(() => {
    enableTauri();
    writeTextFileSpy.mockClear();
    readTextFileSpy.mockClear();
    saveDialogSpy.mockClear();
    openDialogSpy.mockClear();
    localStorage.clear();
  });
  afterEach(() => disableTauri());

  it('saveProjectAs writes via Tauri fs to dialog-selected path', async () => {
    const { saveProjectAs } = await import('@/lib/storage');
    const path = await saveProjectAs(sampleProject);
    expect(path).toBe('/home/user/Documents/test.neiscut');
    expect(saveDialogSpy).toHaveBeenCalledTimes(1);
    expect(writeTextFileSpy).toHaveBeenCalledTimes(1);
    const [calledPath, calledContent] = writeTextFileSpy.mock.calls[0];
    expect(calledPath).toBe('/home/user/Documents/test.neiscut');
    const parsed = JSON.parse(calledContent);
    expect(parsed.meta.school).toBe('테스트고등학교');
    expect(parsed.items).toHaveLength(2);
  });

  it('saveProjectAs returns null when user cancels dialog', async () => {
    saveDialogSpy.mockResolvedValueOnce(null);
    const { saveProjectAs } = await import('@/lib/storage');
    const path = await saveProjectAs(sampleProject);
    expect(path).toBeNull();
    expect(writeTextFileSpy).not.toHaveBeenCalled();
  });

  it('saveProjectAs propagates fs errors (so UI can show toast)', async () => {
    writeTextFileSpy.mockRejectedValueOnce(new Error('forbidden path: scope violation'));
    const { saveProjectAs } = await import('@/lib/storage');
    await expect(saveProjectAs(sampleProject)).rejects.toThrow(/scope violation/);
  });

  it('saveProjectToPath writes to the given path', async () => {
    const { saveProjectToPath } = await import('@/lib/storage');
    const ok = await saveProjectToPath('/some/explicit/path.neiscut', sampleProject);
    expect(ok).toBe(true);
    expect(writeTextFileSpy).toHaveBeenCalledWith(
      '/some/explicit/path.neiscut',
      expect.stringContaining('테스트고등학교'),
    );
  });

  it('openProject reads via Tauri fs from dialog-selected path', async () => {
    const { openProject } = await import('@/lib/storage');
    const project = await openProject();
    expect(openDialogSpy).toHaveBeenCalledTimes(1);
    expect(readTextFileSpy).toHaveBeenCalledWith('/home/user/Documents/test.neiscut');
    expect(project?.meta.school).toBe('테스트고등학교');
    expect(project?.items).toHaveLength(2);
  });

  it('openProject round-trip preserves all fields', async () => {
    const { saveProjectAs, openProject } = await import('@/lib/storage');
    let writtenContent = '';
    writeTextFileSpy.mockImplementationOnce(async (_p, content) => { writtenContent = content; });
    await saveProjectAs(sampleProject);
    readTextFileSpy.mockResolvedValueOnce(writtenContent);
    const restored = await openProject();
    expect(restored).toEqual(sampleProject);
  });

  it('openProjectFromPath reads from given path and adds to recent files', async () => {
    const { openProjectFromPath, getRecentFiles } = await import('@/lib/storage');
    const project = await openProjectFromPath('/old/path.neiscut');
    expect(project?.meta.school).toBe('테스트고등학교');
    expect(getRecentFiles()).toContain('/old/path.neiscut');
  });

  it('openProject propagates fs errors (so UI can show toast)', async () => {
    readTextFileSpy.mockRejectedValueOnce(new Error('permission denied'));
    const { openProject } = await import('@/lib/storage');
    await expect(openProject()).rejects.toThrow(/permission denied/);
  });

  it('addToRecentFiles deduplicates and keeps max 10', async () => {
    const { addToRecentFiles, getRecentFiles } = await import('@/lib/storage');
    for (let i = 0; i < 12; i++) addToRecentFiles(`/p${i}.neiscut`);
    addToRecentFiles('/p3.neiscut');
    const list = getRecentFiles();
    expect(list).toHaveLength(10);
    expect(list[0]).toBe('/p3.neiscut');
    expect(list.filter((p) => p === '/p3.neiscut')).toHaveLength(1);
  });
});

describe('storage.ts (browser env, no Tauri)', () => {
  beforeEach(() => {
    disableTauri();
    writeTextFileSpy.mockClear();
    readTextFileSpy.mockClear();
    saveDialogSpy.mockClear();
    openDialogSpy.mockClear();
  });

  it('saveProjectToPath returns false in browser (no fs)', async () => {
    const { saveProjectToPath } = await import('@/lib/storage');
    const ok = await saveProjectToPath('/x.neiscut', sampleProject);
    expect(ok).toBe(false);
    expect(writeTextFileSpy).not.toHaveBeenCalled();
  });

  it('openProjectFromPath returns null in browser', async () => {
    const { openProjectFromPath } = await import('@/lib/storage');
    const project = await openProjectFromPath('/x.neiscut');
    expect(project).toBeNull();
    expect(readTextFileSpy).not.toHaveBeenCalled();
  });

  it('saveProjectAs falls back to Blob download in browser', async () => {
    const clickSpy = vi.fn();
    const createSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock');
    const revokeSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    const origCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const el = origCreateElement(tag);
      if (tag === 'a') {
        Object.defineProperty(el, 'click', { value: clickSpy });
      }
      return el;
    });
    const { saveProjectAs } = await import('@/lib/storage');
    const result = await saveProjectAs(sampleProject);
    expect(result).toBeNull();
    expect(saveDialogSpy).not.toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(revokeSpy).toHaveBeenCalled();
    vi.restoreAllMocks();
  });
});
