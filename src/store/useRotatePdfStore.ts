import { create } from "zustand";
import type { PageResult } from "../types/pageResult";

interface RotatedStore {
  results: PageResult[];
  setResults: (results: PageResult[]) => void;
  clearResults: () => void;

  selectRotateFile: File | null;
  setSelectRotateFile: (file: File) => void;
  clearSelectRotateFile: () => void;

  rotatePdfIndexes: number[];
  setRotatePdfIndexes: (index: number[]) => void;
  clearRotatePdf: () => void;
}

export const useRotatedPdfStore = create<RotatedStore>((set) => ({
  results: [],
  setResults: (results: PageResult[]) => set({ results }),
  clearResults: () => set({ results: [] }),

  selectRotateFile: null,
  setSelectRotateFile: (file: File) => set({ selectRotateFile: file }),
  clearSelectRotateFile: () => set({ selectRotateFile: null }),

  rotatePdfIndexes: [],
  setRotatePdfIndexes: (index: number[]) => set({ rotatePdfIndexes: index }),
  clearRotatePdf: () => set({ rotatePdfIndexes: [] }),
}));
