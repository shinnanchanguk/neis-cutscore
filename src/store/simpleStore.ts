import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Difficulty, Grade } from '@/lib/types';

interface SectionInputs {
  categoryPoints: Record<Difficulty, number>;
  desiredCutScores: Record<Grade, number>;
}

interface SimpleState {
  /** 1차 섹션: 분리 OFF면 전체, 분리 ON이면 선택형 */
  categoryPoints: Record<Difficulty, number>;
  desiredCutScores: Record<Grade, number>;
  spread: number;
  /** 서답형 섹션 (분리 ON에서만 사용) */
  subjective: SectionInputs;

  setCategoryPoints: (difficulty: Difficulty, value: number) => void;
  setDesiredCutScore: (grade: Grade, value: number) => void;
  setSpread: (value: number) => void;
  setSubjectiveCategoryPoints: (difficulty: Difficulty, value: number) => void;
  setSubjectiveDesiredCutScore: (grade: Grade, value: number) => void;
}

type SimplePersistedState = Pick<
  SimpleState,
  'categoryPoints' | 'desiredCutScores' | 'spread' | 'subjective'
>;

function emptyCategoryPoints(): Record<Difficulty, number> {
  return { '쉬움': 0, '보통': 0, '어려움': 0 };
}

function emptyDesiredCutScores(): Record<Grade, number> {
  return { A: 0, B: 0, C: 0, D: 0, E: 0 };
}

function createInitialSimpleState(): SimplePersistedState {
  return {
    categoryPoints: emptyCategoryPoints(),
    desiredCutScores: emptyDesiredCutScores(),
    spread: 15,
    subjective: {
      categoryPoints: emptyCategoryPoints(),
      desiredCutScores: emptyDesiredCutScores(),
    },
  };
}

export const useSimpleStore = create<SimpleState>()(
  persist(
    (set) => ({
      ...createInitialSimpleState(),

      setCategoryPoints: (difficulty, value) => {
        set((state) => ({
          categoryPoints: { ...state.categoryPoints, [difficulty]: value },
        }));
      },

      setDesiredCutScore: (grade, value) => {
        set((state) => ({
          desiredCutScores: { ...state.desiredCutScores, [grade]: value },
        }));
      },

      setSpread: (value) => {
        set({ spread: value });
      },

      setSubjectiveCategoryPoints: (difficulty, value) => {
        set((state) => ({
          subjective: {
            ...state.subjective,
            categoryPoints: { ...state.subjective.categoryPoints, [difficulty]: value },
          },
        }));
      },

      setSubjectiveDesiredCutScore: (grade, value) => {
        set((state) => ({
          subjective: {
            ...state.subjective,
            desiredCutScores: { ...state.subjective.desiredCutScores, [grade]: value },
          },
        }));
      },
    }),
    {
      name: 'neis-simple-store',
      version: 4,
      // 기존 1차(선택형/전체) 입력을 보존하고 subjective(서답형) 기본값을 보강
      migrate: (persisted) => {
        const base = createInitialSimpleState();
        if (!persisted || typeof persisted !== 'object') return base;
        const p = persisted as Partial<SimplePersistedState>;
        return {
          categoryPoints: p.categoryPoints ?? base.categoryPoints,
          desiredCutScores: p.desiredCutScores ?? base.desiredCutScores,
          spread: typeof p.spread === 'number' ? p.spread : base.spread,
          subjective: p.subjective ?? base.subjective,
        };
      },
    }
  )
);
