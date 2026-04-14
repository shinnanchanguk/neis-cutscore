import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ExamMeta, ExamProject, Grade, Item, PresetName, TargetDistribution } from '@/lib/types';
import { DEFAULT_EXPECTED_UNMET_RATE, PRESETS } from '@/lib/presets';

interface ExamSettings {
  includeE미도달: boolean;
  expectedUnmetRate: number;
  darkMode: 'system' | 'light' | 'dark';
  onboardingCompleted: boolean;
  mode: 'detail' | 'simple';
}

interface ExamState {
  meta: ExamMeta;
  targetDistribution: TargetDistribution;
  presetName: PresetName;
  items: Item[];
  settings: ExamSettings;
  currentFilePath: string | null;

  // Actions
  setMeta: (patch: Partial<ExamMeta>) => void;
  setPreset: (name: PresetName) => void;
  setTargetField: (grade: Grade, value: number) => void;
  addItem: () => void;
  addBulkItems: (count: number) => void;
  updateItem: (id: string, patch: Partial<Item>) => void;
  removeItem: (id: string) => void;
  duplicateItem: (id: string) => void;
  sortItems: (by: 'difficulty' | 'number') => void;
  reorderItems: (fromIndex: number, toIndex: number) => void;
  setSetting: <K extends keyof ExamSettings>(key: K, value: ExamSettings[K]) => void;
  loadProject: (project: ExamProject) => void;
  exportProject: () => ExamProject;
  resetToDefaults: () => void;
}

const DIFFICULTY_SORT_ORDER = { '쉬움': 0, '보통': 1, '어려움': 2 } as const;

function renumber(items: Item[]): Item[] {
  return items.map((item, index) => ({ ...item, number: index + 1 }));
}

function createDefaultItem(): Omit<Item, 'id' | 'number'> {
  return {
    difficulty: '보통',
    points: 4,
    expectedRate: 60,
  };
}

const DEFAULT_META: ExamMeta = {
  school: '',
  subject: '',
  gradeLevel: '',
  examName: '2026-1 중간고사',
};

const DEFAULT_SETTINGS: ExamSettings = {
  includeE미도달: true,
  expectedUnmetRate: DEFAULT_EXPECTED_UNMET_RATE,
  darkMode: 'light',
  onboardingCompleted: false,
  mode: 'detail',
};

const DEFAULT_PRESET: PresetName = '일반고';

export const useExamStore = create<ExamState>()(
  persist(
    (set, get) => ({
      meta: { ...DEFAULT_META },
      targetDistribution: { ...PRESETS[DEFAULT_PRESET] },
      presetName: DEFAULT_PRESET,
      items: [],
      settings: { ...DEFAULT_SETTINGS },
      currentFilePath: null,

      setMeta: (patch) => {
        set((state) => ({ meta: { ...state.meta, ...patch } }));
      },

      setPreset: (name) => {
        set({
          presetName: name,
          targetDistribution: { ...PRESETS[name] },
        });
      },

      setTargetField: (grade, value) => {
        set((state) => ({
          targetDistribution: { ...state.targetDistribution, [grade]: value },
          presetName: '사용자정의',
        }));
      },

      addItem: () => {
        set((state) => {
          const newItem: Item = {
            id: crypto.randomUUID(),
            number: state.items.length + 1,
            ...createDefaultItem(),
          };
          return { items: [...state.items, newItem] };
        });
      },

      addBulkItems: (count) => {
        set((state) => {
          const newItems: Item[] = Array.from({ length: count }, (_, i) => ({
            id: crypto.randomUUID(),
            number: state.items.length + i + 1,
            ...createDefaultItem(),
          }));
          return { items: [...state.items, ...newItems] };
        });
      },

      updateItem: (id, patch) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...patch } : item
          ),
        }));
      },

      removeItem: (id) => {
        set((state) => ({
          items: renumber(state.items.filter((item) => item.id !== id)),
        }));
      },

      duplicateItem: (id) => {
        set((state) => {
          const index = state.items.findIndex((item) => item.id === id);
          if (index === -1) return state;
          const original = state.items[index];
          const copy: Item = { ...original, id: crypto.randomUUID() };
          const newItems = [
            ...state.items.slice(0, index + 1),
            copy,
            ...state.items.slice(index + 1),
          ];
          return { items: renumber(newItems) };
        });
      },

      sortItems: (by) => {
        set((state) => {
          const sorted = [...state.items].sort((a, b) => {
            if (by === 'difficulty') {
              return DIFFICULTY_SORT_ORDER[a.difficulty] - DIFFICULTY_SORT_ORDER[b.difficulty];
            }
            return a.number - b.number;
          });
          return { items: renumber(sorted) };
        });
      },

      reorderItems: (fromIndex, toIndex) => {
        set((state) => {
          const newItems = [...state.items];
          const [moved] = newItems.splice(fromIndex, 1);
          newItems.splice(toIndex, 0, moved);
          return { items: renumber(newItems) };
        });
      },

      setSetting: (key, value) => {
        set((state) => ({
          settings: { ...state.settings, [key]: value },
        }));
      },

      loadProject: (project) => {
        set({
          meta: project.meta,
          targetDistribution: project.targetDistribution,
          items: renumber(project.items),
          settings: {
            ...DEFAULT_SETTINGS,
            includeE미도달: project.settings.includeE미도달,
            expectedUnmetRate: project.settings.expectedUnmetRate ?? DEFAULT_EXPECTED_UNMET_RATE,
          },
          presetName: '사용자정의',
          currentFilePath: null,
        });
      },

      exportProject: () => {
        const state = get();
        const now = new Date().toISOString();
        return {
          meta: state.meta,
          targetDistribution: state.targetDistribution,
          items: state.items,
          settings: {
            includeE미도달: state.settings.includeE미도달,
            expectedUnmetRate: state.settings.expectedUnmetRate ?? DEFAULT_EXPECTED_UNMET_RATE,
          },
          createdAt: now,
          updatedAt: now,
          version: '1.0.0',
        };
      },

      resetToDefaults: () => {
        set({
          meta: { ...DEFAULT_META },
          targetDistribution: { ...PRESETS[DEFAULT_PRESET] },
          presetName: DEFAULT_PRESET,
          items: [],
          settings: { ...DEFAULT_SETTINGS },
          currentFilePath: null,
        });
      },
    }),
    {
      name: 'neis-cutscore-store',
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<ExamState>;
        return {
          ...currentState,
          ...persisted,
          settings: {
            ...currentState.settings,
            ...persisted.settings,
          },
        };
      },
    }
  )
);
