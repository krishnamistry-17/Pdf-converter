import { create } from "zustand";

type SplitRange = { from: string; to: string };

interface SplitStore {
  splitRangeType: "Range" | "Pages" | "Size";
  setSplitRangeType: (type: "Range" | "Pages" | "Size") => void;

  results: any[];
  setResults: (results: any[]) => void;
  clearResults: () => void;

  activeMode: "custome" | "fixed";
  setActiveMode: (mode: "custome" | "fixed") => void;

  activeRange: SplitRange[];
  setActiveRange: (ranges: SplitRange[]) => void;

  pageRange: string;
  setPageRange: (value: string) => void;
  
  sizeUnit: "KB" | "MB";
  setSizeUnit: (unit: "KB" | "MB") => void;
  clearSizeUnit: () => void;
  
  totalPages: number;
  setTotalPages: (pages: number) => void;
  clearTotalPages: () => void;
  
  pageExtractMode: "extractAll" | "selectPages";
  setPageExtractMode: (mode: "extractAll" | "selectPages") => void;
  clearPageExtractMode: () => void;
  clearSelectedRange: () => void;
}

const useSplitStore = create<SplitStore>((set) => ({
  splitRangeType: "Range",
  results: [],
  activeMode: "custome",
  activeRange: [], //set activerang empty and set range in range component
  pageRange: "",
  setActiveMode: (mode) => set({ activeMode: mode }),
  setActiveRange: (ranges) => set({ activeRange: ranges }),
  setPageRange: (value) => set({ pageRange: value }),
  setResults: (results) => set({ results }),
  clearResults: () => set({ results: [] }),
  clearSelectedRange: () => set({ activeRange: [], pageRange: "" }),
  sizeUnit: "MB",
  setSizeUnit: (unit) => set({ sizeUnit: unit }),
  clearSizeUnit: () => set({ sizeUnit: "MB" }),
  setSplitRangeType: (type) => set({ splitRangeType: type }),
  pageExtractMode: "extractAll",
  setPageExtractMode: (mode) => set({ pageExtractMode: mode }),
  clearPageExtractMode: () => set({ pageExtractMode: "extractAll" }),

  totalPages: 0,
  setTotalPages: (pages) => set({ totalPages: pages }),
  clearTotalPages: () => set({ totalPages: 0 }),
}));

export default useSplitStore;
