import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Difficulty, Grade } from '@/lib/types';

interface SimpleState {
  categoryPoints: Record<Difficulty, number>;
  desiredCutScores: Record<Grade, number>;
  spread: number;

  setCategoryPoints: (difficulty: Difficulty, value: number) => void;
  setDesiredCutScore: (grade: Grade, value: number) => void;
  setSpread: (value: number) => void;
}

type SimplePersistedState = Pick<
  SimpleState,
  'categoryPoints' | 'desiredCutScores' | 'spread'
>;

function createInitialSimpleState(): SimplePersistedState {
  return {
    categoryPoints: { '쉬움': 0, '보통': 0, '어려움': 0 },
    desiredCutScores: { A: 0, B: 0, C: 0, D: 0, E: 0 },
    spread: 15,
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
    }),
    {
      name: 'neis-simple-store',
      version: 2,
      migrate: () => createInitialSimpleState(),
    }
  )
);
