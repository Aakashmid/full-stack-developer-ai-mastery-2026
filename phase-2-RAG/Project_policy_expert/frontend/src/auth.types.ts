// Add custom types for your application
export interface PolicyDocument {
  id: number;
  title: string;
  file_url: string;
  uploaded_at: string;
  user: number;
}

export interface QueryResult {
  query: string;
  answer: string;
  sources: string[];
  confidence: number;
}