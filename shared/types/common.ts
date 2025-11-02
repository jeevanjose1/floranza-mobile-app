
export interface FetcherType {
  url: string;
  data?: any;
  authenticated?: boolean;
  type?: 'get' | 'post' | 'put' | 'delete' | 'patch';
  headers?: Record<string, string>;
  onUploadProgress?: (progressEvent: ProgressEvent) => void;
  cacheKey?: string; // optional custom cache key
  cacheTime?: number; // in ms
}