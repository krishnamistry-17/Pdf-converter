import { create } from "zustand";
import type { ImageResult } from "../types/pageResult";

interface ImageStore {
  results: ImageResult[];
  setResults: (results: ImageResult[]) => void;
  clearResults: () => void;
}

const useImageStore = create<ImageStore>((set) => ({
  results: [],
  setResults: (results: ImageResult[]) => set({ results }),
  clearResults: () => set({ results: [] }),
}));

export default useImageStore;
