import { create } from "zustand";
import type { ImageResult } from "../types/pageResult";

interface ImageStore {
  results: ImageResult[];
  setResults: (results: ImageResult[]) => void;
  clearResults: () => void;

  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  clearSelectedFile: () => void;
}

const useImageStore = create<ImageStore>((set) => ({
  results: [],
  setResults: (results: ImageResult[]) => set({ results }),
  clearResults: () => set({ results: [] }),

  selectedFile: null,
  setSelectedFile: (file: File | null) => set({ selectedFile: file }),
  clearSelectedFile: () => set({ selectedFile: null }),
}));

export default useImageStore;
