import { create } from "zustand";
import type { CropPdfResult } from "../types/pageResult";

interface CropPdfStore {
  selectCropPdfFile: File | null;
  setSelectCropPdfFile: (file: File) => void;
  clearSelectCropPdfFile: () => void;

  results: CropPdfResult[];
  setResults: (results: CropPdfResult[]) => void;
  clearResults: () => void;

  cropResults: CropPdfResult[];
  setCropResults: (results: CropPdfResult[]) => void;
  clearCropResults: () => void;

  cropBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  setCropBox: (cropBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => void;
  clearCropBox: () => void;

  selectedPageType: "current" | "all";
  setSelectedPageType: (type: "current" | "all") => void;
  clearSelectedPageType: () => void;
}

export const useCropPdfStore = create<CropPdfStore>((set) => ({
  selectCropPdfFile: null,
  setSelectCropPdfFile: (file: File) => set({ selectCropPdfFile: file }),
  clearSelectCropPdfFile: () => set({ selectCropPdfFile: null }),

  results: [],
  setResults: (results: CropPdfResult[]) => set({ results }),
  clearResults: () => set({ results: [] }),

  cropResults: [],
  setCropResults: (results: CropPdfResult[]) => set({ cropResults: results }),
  clearCropResults: () => set({ cropResults: [] }),

  cropBox: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },
  setCropBox: (cropBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => set({ cropBox: cropBox }),
  clearCropBox: () => set({ cropBox: { x: 0, y: 0, width: 0, height: 0 } }),

  selectedPageType: "current",
  setSelectedPageType: (type: "current" | "all") => set({ selectedPageType: type }),
  clearSelectedPageType: () => set({ selectedPageType: "current" }),
}));
