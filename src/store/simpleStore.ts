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

export const useSimpleStore = create<SimpleState>()(
  persist(
    (set) => ({
      categoryPoints: { '쉬움': 28, '보통': 42, '어려움': 30 },
      desiredCutScores: { A: 75, B: 58, C: 41, D: 27, E: 11 },
      spread: 15,

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
    }
  )
);
