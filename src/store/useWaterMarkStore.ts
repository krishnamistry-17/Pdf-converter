import { create } from "zustand";
import type { WaterMarkPosition } from "../types/watermarkPosition";

interface WaterMarkStore {
  results: any[];
  setResults: (results: any[]) => void;
  clearResults: () => void;

  selectedFile: File | null;
  setSelectedFile: (file: File) => void;
  clearSelectedFile: () => void;

  watermarkText: string;
  setWatermarkText: (text: string) => void;
  clearWatermarkText: () => void;

  watermarkPosition: WaterMarkPosition;
  setWatermarkPosition: (position: WaterMarkPosition) => void;
  clearWatermarkPosition: () => void;

  watermarkType: "Place Text" | "Place Image";
  setWatermarkType: (type: "Place Text" | "Place Image") => void;
  clearWatermarkType: () => void;
}

const useWaterMarkStore = create<WaterMarkStore>((set) => ({
  results: [],
  setResults: (results: any[]) => set({ results }),
  clearResults: () => set({ results: [] }),

  selectedFile: null,
  setSelectedFile: (file: File) => set({ selectedFile: file }),
  clearSelectedFile: () => set({ selectedFile: null }),

  watermarkText: "",
  setWatermarkText: (text: string) => set({ watermarkText: text }),
  clearWatermarkText: () => set({ watermarkText: "" }),
  
  watermarkPosition: "top-left",
  setWatermarkPosition: (position: WaterMarkPosition) =>
    set({ watermarkPosition: position }),
  clearWatermarkPosition: () => set({ watermarkPosition: "top-left" }),

  watermarkType: "Place Text",
  setWatermarkType: (type: "Place Text" | "Place Image") =>
    set({ watermarkType: type }),
  clearWatermarkType: () => set({ watermarkType: "Place Text" }),
}));

export default useWaterMarkStore;
