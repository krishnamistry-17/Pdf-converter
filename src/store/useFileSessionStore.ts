import { create } from "zustand";

interface FileSessionStore {
  selectedFile: File | null;
  previewUrl: string | null;
  setSelectedFile: (file: File) => void;
  clearSelectedFile: () => void;

  results: any[];
  setResults: (results: any[]) => void;
  clearResults: () => void;

  downloadCompleted: boolean;
  setDownloadCompleted: (completed: boolean) => void;
  clearDownloadCompleted: () => void;
}

export const useFileSessionStore = create<FileSessionStore>((set) => ({
  selectedFile: null,
  previewUrl: null,

  setSelectedFile: (file) => {
    set({
      selectedFile: file,
      previewUrl: URL.createObjectURL(file),
    });
  },

  results: [],
  setResults: (results: any[]) => set({ results }),
  clearResults: () => set({ results: [] }),

  clearSelectedFile: () =>
    set({
      selectedFile: null,
      previewUrl: null,
    }),

  downloadCompleted: false,
  setDownloadCompleted: (completed: boolean) =>
    set({ downloadCompleted: completed }),
  clearDownloadCompleted: () => set({ downloadCompleted: false }),
}));
