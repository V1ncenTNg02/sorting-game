export interface IMigrationRunner {
  runPending(): Promise<void>;
}
