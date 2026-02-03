import { create } from "zustand";

interface ExtractStore {
  results: string[];
  setResults: (results: string[]) => void;
  clearResults: () => void;

  selectedFile: File | null;
  setSelectedFile: (file: File) => void;
  clearSelectedFile: () => void;

  extractResults: string[];
  setExtractResults: (results: string[]) => void;
  clearExtractResults: () => void;

  extractType: "pdf" | "images";
  setExtractType: (type: "pdf" | "images") => void;
  clearExtractType: () => void;
}

const useExtractPdfStore = create<ExtractStore>((set) => ({
  results: [],
  setResults: (results: string[]) => set({ results: results }),
  clearResults: () => set({ results: [] }),

  selectedFile: null,
  setSelectedFile: (file: File) => set({ selectedFile: file }),
  clearSelectedFile: () => set({ selectedFile: null }),

  extractResults: [],
  setExtractResults: (results: string[]) => set({ extractResults: results }),
  clearExtractResults: () => set({ extractResults: [] }),

  extractType: "pdf",
  setExtractType: (type: "pdf" | "images") => set({ extractType: type }),
  clearExtractType: () => set({ extractType: "pdf" }),
}));

export default useExtractPdfStore;
