export interface VisionImageRequest {
  content: string;
  imageUri: string;
}

export interface VisionImageResponse {
  responses: Array<{ fullTextAnnotation: { text: string } }>;
}
