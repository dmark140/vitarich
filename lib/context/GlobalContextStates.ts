export interface StoreState {
  blockingRules?: Array<{ id: number; name: string; condition: string; message: string }>;
  theme?: 'light' | 'dark';
  [key: string]: any; 
}