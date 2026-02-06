import type { PageNumberPosition } from "./pagenumberPosition";

export interface PageResult {
  name: string;
  blob: Blob;
  url: string;
  pages: number;
  rotation: number;
  fileName: string;
}



export interface PageNumberOptions {
  position: PageNumberPosition;
  startFrom?: number;
  range?: {
    from: number;
    to: number;
  };
  fileName?: string;
  text?: string;
  rangeType?: "odd" | "even" | "all";
  numberType?: "arabic" | "roman";
}

export interface ImageResult {
  name: string;
  url: string;
  blob: Blob;
}

export interface EditPdfResult {
  name: string;
  blob: Blob;
  url: string;
  fileName: string;
  
}

export interface CropPdfResult {
  name: string;
  blob: Blob;
  url: string;
  pages: number;
  fileName: string;
}

export type CompressionLevel = "low" | "medium" | "high";

export interface CompressPercentage {
  originalSize: string;
  compressedSize: string;
  compressPercentage: string;
}
