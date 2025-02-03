export type VisionImageRequest = {
  content: string;
  imageUri: string;
};

export type VisionImageResponse = {
  responses: Array<{ fullTextAnnotation: { text: string } }>;
};
