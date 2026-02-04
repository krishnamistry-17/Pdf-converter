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

  summerizeText: string;
  setSummerizeText: (text: string) => void;
  clearSummerizeText: () => void;

  summaryStatus: "idle" | "loading" | "options" | "done";
  setSummaryStatus: (status: "idle" | "loading" | "options" | "done") => void;
  clearSummaryStatus: () => void;

  summaryType: "executive" | "keypoints";
  setSummaryType: (type: "executive" | "keypoints") => void;
  clearSummaryType: () => void;

  summaryResult: string | string[];
  setSummaryResult: (result: string) => void;
  clearSummaryResult: () => void;
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
  setSelectedLanguage: (language: string) =>
    set({ selectedLanguage: language }),
  clearSelectedLanguage: () => set({ selectedLanguage: "eng" }),

  summaryStatus: "idle",
  setSummaryStatus: (status: "idle" | "loading" | "options" | "done") =>
    set({ summaryStatus: status }),
  clearSummaryStatus: () => set({ summaryStatus: "idle" }),

  summaryType: "executive",
  setSummaryType: (type: "executive" | "keypoints") =>
    set({ summaryType: type }),
  clearSummaryType: () => set({ summaryType: "executive" }),

  summaryResult: "",
  setSummaryResult: (result: string) =>
    set({ summaryResult: result }),
  clearSummaryResult: () => set({ summaryResult: "" }),

  summerizeText: "",
  setSummerizeText: (text: string) => set({ summerizeText: text }),
  clearSummerizeText: () => set({ summerizeText: "" }),
}));

export default useExtractPdfStore;
