import { create } from "zustand";
import type { PageResult } from "../types/pageResult";
import type { PageNumberPosition } from "../types/pagenumberPosition";

interface PdfPageNumbersStore {
  results: PageResult[];
  setResults: (results: PageResult[]) => void;
  clearResults: () => void;

  selectPdfPageNumberFile: File | null;
  setSelectPdfPageNumberFile: (file: File) => void;
  clearSelectPdfPageNumberFile: () => void;

  pageNumbers: number[];
  setPageNumbers: (pageNumbers: number[]) => void;
  clearPageNumbers: () => void;

  pageMode: "single" | "multiple";
  setPageMode: (mode: "single" | "multiple") => void;
  clearPageMode: () => void;

  selectedTextName: string;
  setSelectedTextName: (name: string) => void;
  clearSelectedTextName: () => void;

  firstNumber: number;
  setFirstNumber: (number: number) => void;
  clearFirstNumber: () => void;

  firstPage: number;
  setFirstPage: (page: number) => void;
  clearFirstPage: () => void;

  lastPage: number;
  setLastPage: (page: number) => void;
  clearLastPage: () => void;

  pageNumberPosition: PageNumberPosition;
  setPageNumberPosition: (position: PageNumberPosition) => void;
  clearPageNumberPosition: () => void;

  selectedRangeType: "all" | "odd" | "even";
  setSelectedRangeType: (type: "all" | "odd" | "even") => void;

  selectedNumberType: "arabic" | "roman";
  setSelectedNumberType: (type: "arabic" | "roman") => void;

  selectedName: string;
  setSelectedName: (name: string) => void;
  clearSelectedName: () => void;
}

export const usePdfPageNumbersStore = create<PdfPageNumbersStore>((set) => ({
  results: [],
  setResults: (results: PageResult[]) => set({ results }),
  clearResults: () => set({ results: [] }),

  selectPdfPageNumberFile: null,
  setSelectPdfPageNumberFile: (file: File) =>
    set({ selectPdfPageNumberFile: file }),
  clearSelectPdfPageNumberFile: () => set({ selectPdfPageNumberFile: null }),

  pageNumbers: [],
  setPageNumbers: (pageNumbers: number[]) => set({ pageNumbers }),
  clearPageNumbers: () => set({ pageNumbers: [] }),

  firstNumber: 1,
  setFirstNumber: (number: number) => set({ firstNumber: number }),
  clearFirstNumber: () => set({ firstNumber: 1 }),

  selectedRangeType: "all",
  setSelectedRangeType: (type: "all" | "odd" | "even") =>
    set({ selectedRangeType: type }),

  selectedNumberType: "arabic",
  setSelectedNumberType: (type: "arabic" | "roman") =>
    set({ selectedNumberType: type }),

  firstPage: 1,
  setFirstPage: (page: number) => set({ firstPage: page }),
  clearFirstPage: () => set({ firstPage: 1 }),

  lastPage: 0,
  setLastPage: (page: number) => set({ lastPage: page }),
  clearLastPage: () => set({ lastPage: 0 }),

  pageMode: "single",
  setPageMode: (mode: "single" | "multiple") => set({ pageMode: mode }),
  clearPageMode: () => set({ pageMode: "single" }),

  selectedTextName: "Recommended",
  setSelectedTextName: (name: string) => set({ selectedTextName: name }),
  clearSelectedTextName: () => set({ selectedTextName: "Recommended" }),

  pageNumberPosition: "bottom-right",
  setPageNumberPosition: (position: PageNumberPosition) =>
    set({ pageNumberPosition: position }),
  clearPageNumberPosition: () => set({ pageNumberPosition: "bottom-right" }),

  selectedName: "Recommended",
  setSelectedName: (name: string) => set({ selectedName: name }),
  clearSelectedName: () => set({ selectedName: "Recommended" }),
}));
