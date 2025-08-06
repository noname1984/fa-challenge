export interface MessageType {
  content: string;
  role: string;
  id: number;
  ttft?: number;
  responseTime?: number;
  tokenps?: number;
}
