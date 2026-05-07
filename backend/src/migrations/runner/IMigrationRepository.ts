export interface IMigrationRepository {
  ensureTrackerTable(): Promise<void>;
  getApplied(): Promise<string[]>;
  record(filename: string): Promise<void>;
}
