import { create } from "zustand";
import type { ImageResult } from "../types/pageResult";

interface ImageStore {
  results: ImageResult[];
  setResults: (results: ImageResult[]) => void;
  clearResults: () => void;

  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  clearSelectedFile: () => void;

  selectedPageType: "all" | "zip";
  setSelectedPageType: (type: "all" | "zip") => void;
  clearSelectedPageType: () => void;
}

const useImageStore = create<ImageStore>((set) => ({
  results: [],
  setResults: (results: ImageResult[]) => set({ results }),
  clearResults: () => set({ results: [] }),

  selectedFile: null,
  setSelectedFile: (file: File | null) => set({ selectedFile: file }),
  clearSelectedFile: () => set({ selectedFile: null }),

  selectedPageType: "all",
  setSelectedPageType: (type: "all" | "zip") => set({ selectedPageType: type }),
  clearSelectedPageType: () => set({ selectedPageType: "all" }),
}));

export default useImageStore;
