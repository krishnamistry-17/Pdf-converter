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

  ocrLoading: boolean;
  setOcrLoading: (loading: boolean) => void;
  clearOcrLoading: () => void;

  extractType: "pdf" | "images";
  setExtractType: (type: "pdf" | "images") => void;
  clearExtractType: () => void;

  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  clearSelectedLanguage: () => void;
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

  ocrLoading: false,
  setOcrLoading: (loading: boolean) => set({ ocrLoading: loading }),
  clearOcrLoading: () => set({ ocrLoading: false }),

  extractType: "pdf",
  setExtractType: (type: "pdf" | "images") => set({ extractType: type }),
  clearExtractType: () => set({ extractType: "pdf" }),

  selectedLanguage: "eng",
  setSelectedLanguage: (language: string) => set({ selectedLanguage: language }),
  clearSelectedLanguage: () => set({ selectedLanguage: "eng" }),
}));

export default useExtractPdfStore;
