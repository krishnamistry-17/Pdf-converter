import { create } from "zustand";
import type { EditPdfResult } from "../types/pageResult";

export interface TextTool {
  pageIndex: number;
  id: string;
  text: string;
  xRatio: number;
  yRatio: number;
  fontSizeRatio: number;
}

export interface DrawTool {
  pageIndex: number;
  id: string;
  xRatio: number;
  yRatio: number;
  color: string;
  width: number;
}

export interface Path {
  pageIndex: number;
  id: string;
  positions: { xRatio: number; yRatio: number }[];
  color: string;
  width: number;
}

interface EditPdfStore {
  results: EditPdfResult[];
  setResults: (results: EditPdfResult[]) => void;
  clearResults: () => void;

  selectedFile: File | null;
  setSelectedFile: (file: File) => void;
  clearSelectedFile: () => void;

  activeTool: "annotate" | "edit";
  setActiveTool: (tool: "annotate" | "edit") => void;
  clearActiveTool: () => void;

  activeToolFeature: "text" | "draw" | "highlight" | "image";
  setActiveToolFeature: (
    feature: "text" | "draw" | "highlight" | "image"
  ) => void;
  clearActiveToolFeature: () => void;

  textElements: TextTool[];
  setTextElements: (elements: TextTool[]) => void;

  drawElements: DrawTool[];
  setDrawElements: (elements: DrawTool[]) => void;

  addDraw: (
    pageIndex: number,
    xRatio: number,
    yRatio: number,
    color: string,
    width: number
  ) => void;
  removeDraw: (id: string) => void;
  updateDraw: (
    id: string,
    xRatio: number,
    yRatio: number,
    color: string,
    width: number
  ) => void;

  addText: (
    pageIndex: number,
    xRatio: number,
    yRatio: number,
    fontSizeRatio: number
  ) => void;
  removeText: (id: string) => void;
  updateText: (
    id: string,
    text: string,
    xRatio: number,
    yRatio: number,
    fontSizeRatio: number
  ) => void;
}

export const useEditPdfStore = create<EditPdfStore>((set) => ({
  results: [],
  setResults: (results: EditPdfResult[]) => set({ results }),
  clearResults: () => set({ results: [] }),

  selectedFile: null,
  setSelectedFile: (file: File) => set({ selectedFile: file }),
  clearSelectedFile: () => set({ selectedFile: null }),

  activeTool: "annotate",
  setActiveTool: (tool: "annotate" | "edit") => set({ activeTool: tool }),
  clearActiveTool: () => set({ activeTool: "annotate" }),

  activeToolFeature: "text",
  setActiveToolFeature: (feature: "text" | "draw" | "highlight" | "image") =>
    set({ activeToolFeature: feature }),
  clearActiveToolFeature: () => set({ activeToolFeature: "text" }),

  textElements: [] as TextTool[],
  setTextElements: (elements: TextTool[]) => set({ textElements: elements }),

  drawElements: [] as DrawTool[],
  setDrawElements: (elements: DrawTool[]) => set({ drawElements: elements }),
  addDraw: (
    pageIndex: number,
    xRatio: number,
    yRatio: number,
    color: string,
    width: number
  ) =>
    set((state) => ({
      drawElements: [
        ...state.drawElements,
        {
          id: crypto.randomUUID(),
          pageIndex,
          xRatio,
          yRatio,
          color,
          width,
        },
      ],
    })),

  removeDraw: (id: string) =>
    set((state) => ({
      drawElements: state.drawElements.filter(
        (element: DrawTool) => element.id !== id
      ),
    })),
  updateDraw: (
    id: string,
    xRatio: number,
    yRatio: number,
    color: string,
    width: number
  ) =>
    set((state) => ({
      drawElements: state.drawElements.map((element: DrawTool) =>
          element.id === id ? { ...element, xRatio, yRatio, color, width } : element
      ),
    })),

  addText: (pageIndex, xRatio, yRatio, fontSizeRatio) =>
    set((state) => ({
      textElements: [
        ...state.textElements,
        {
          id: crypto.randomUUID(),
          pageIndex,
          xRatio,
          yRatio,
          fontSizeRatio: Number.isFinite(fontSizeRatio) ? fontSizeRatio : 0.02, // safe default
          text: "",
        },
      ],
    })),

  removeText: (id: string) =>
    set((state) => ({
      textElements: state.textElements.filter(
        (element: TextTool) => element.id !== id
      ),
    })),
  updateText: (
    id: string,
    text: string,
    xRatio: number,
    yRatio: number,
    fontSizeRatio: number
  ) =>
    set((state) => ({
      textElements: state.textElements.map((element: TextTool) =>
        element.id === id
          ? { ...element, text, xRatio, yRatio, fontSizeRatio }
          : element
      ),
    })),
}));
