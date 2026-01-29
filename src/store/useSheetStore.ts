import { create } from "zustand";

interface FileExtensions {
  csv: string;
  xlsx: string;
  xls: string;
  json: string;
  pdf: string;
  docx: string;
  doc: string;
  pptx: string;
  ppt: string;
}

interface FilesStore {
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;

  selectedFile: File | null;
  setSelectedFile: (file: any) => void;
  clearSelectedFile: () => void;
  fileExtension: FileExtensions;

  results: any[];
  setResults: (results: any[]) => void;
  clearResults: () => void;

  previewFile: string | null;
  setPreviewFile: (file: string | null) => void;

  downloadFileUrl: string | null;
  setDownloadFileUrl: (file: string | null) => void;
  clearDownloadFileUrl: () => void;

  downloadFilePreview: string | null;
  setDownloadFilePreview: (file: string | null) => void;
  clearDownloadFilePreview: () => void;

  mergeFile1: File | null;
  mergeFile2: File | null;
  setMergeFile1: (file: File | null) => void;
  setMergeFile2: (file: File | null) => void;
  clearMergeFile1: () => void;
  clearMergeFile2: () => void;

  selectedMergeFile1: File | null;
  selectedMergeFile2: File | null;
  setSelectedMergeFile1: (file: File | null) => void;
  setSelectedMergeFile2: (file: File | null) => void;
  clearSelectedMergeFile1: () => void;
  clearSelectedMergeFile2: () => void;

  mergedPdfPreview: string | null;
  setMergedPdfPreview: (preview: string | null) => void;

  uploadModalOpen: boolean;
  setUploadModalOpen: (open: boolean) => void;
  clearUploadModalOpen: () => void;
}

const useFilesStore = create<FilesStore>((set) => ({
  results: [],
  setResults: (results) => set({ results }),
  clearResults: () => set({ results: [] }),

  loading: false,
  error: null,
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),

  selectedFile: null,
  setSelectedFile: (file) => set({ selectedFile: file }),
  clearSelectedFile: () => set({ selectedFile: null }),

  fileExtension: {
    csv: ".csv",
    xlsx: ".xlsx",
    xls: ".xls",
    json: ".json",
    pdf: ".pdf",
    docx: ".docx",
    doc: ".doc",
    pptx: ".pptx",
    ppt: ".ppt",
  },

  previewFile: null,
  setPreviewFile: (file) => set({ previewFile: file }),

  downloadFilePreview: null,
  setDownloadFilePreview: (file) => set({ downloadFilePreview: file }),
  clearDownloadFilePreview: () => set({ downloadFilePreview: null }),

  downloadFileUrl: null,
  setDownloadFileUrl: (file) => set({ downloadFileUrl: file }),
  clearDownloadFileUrl: () => set({ downloadFileUrl: null }),

  selectedMergeFile1: null,
  selectedMergeFile2: null,
  setSelectedMergeFile1: (file) => set({ selectedMergeFile1: file }),
  setSelectedMergeFile2: (file) => set({ selectedMergeFile2: file }),
  clearSelectedMergeFile1: () => set({ selectedMergeFile1: null }),
  clearSelectedMergeFile2: () => set({ selectedMergeFile2: null }),

  mergeFile1: null,
  mergeFile2: null,
  setMergeFile1: (file) => set({ mergeFile1: file }),
  setMergeFile2: (file) => set({ mergeFile2: file }),
  clearMergeFile1: () => set({ mergeFile1: null }),
  clearMergeFile2: () => set({ mergeFile2: null }),

  mergedPdfPreview: null,
  setMergedPdfPreview: (preview) => set({ mergedPdfPreview: preview }),

  uploadModalOpen: false,
  setUploadModalOpen: (open) => set({ uploadModalOpen: open }),
  clearUploadModalOpen: () => set({ uploadModalOpen: false }),
}));

export default useFilesStore;
