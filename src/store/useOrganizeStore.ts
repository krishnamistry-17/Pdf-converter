import { create } from "zustand";
import type { PageResult } from "../types/pageResult";

interface OrganizeStore {
  selectOrganizeFile: File | null;
  setSelectOrganizeFile: (file: File) => void;
  clearSelectOrganizeFile: () => void;

  blankPage: PageResult | null;
  setBlankPage: (page: PageResult) => void;
  clearBlankPage: () => void;

  results: PageResult[];
  setResults: (results: PageResult[]) => void;
  clearResults: () => void;

  totalPages: number;
  setTotalPages: (pages: number) => void;
  clearTotalPages: () => void;

  sortedResults: PageResult[];
  setSortedResults: (results: PageResult[]) => void;
  clearSortedResults: () => void;

  rotatePdfIndexes: number[];
  setRotatePdfIndexes: (index: number[]) => void;
  clearRotatePdf: () => void;
}

export const useOrganizeStore = create<OrganizeStore>((set) => ({
  selectOrganizeFile: null,
  setSelectOrganizeFile: (file: File) => set({ selectOrganizeFile: file }),
  clearSelectOrganizeFile: () => set({ selectOrganizeFile: null }),

  blankPage: null,
  setBlankPage: (page: PageResult) => set({ blankPage: page }),
  clearBlankPage: () => set({ blankPage: null }),

  results: [],
  setResults: (results: PageResult[]) => set({ results }),
  clearResults: () => set({ results: [] }),

  totalPages: 0,
  setTotalPages: (pages: number) => set({ totalPages: pages }),
  clearTotalPages: () => set({ totalPages: 0 }),

  sortedResults: [],
  setSortedResults: (results: PageResult[]) => set({ sortedResults: results }),
  clearSortedResults: () => set({ sortedResults: [] }),

  rotatePdfIndexes: [],
  setRotatePdfIndexes: (index: number[]) => set({ rotatePdfIndexes: index }),
  clearRotatePdf: () => set({ rotatePdfIndexes: [] }),
}));
