import { QueryResult } from 'pg';

export interface IDatabaseConnection {
  query(text: string, params?: unknown[]): Promise<QueryResult>;
  healthCheck(): Promise<boolean>;
  close(): Promise<void>;
}
