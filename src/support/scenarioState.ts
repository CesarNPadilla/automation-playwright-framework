/** In-memory state owned by one scenario. Never shared across retries or environments. */
export interface ScenarioState {
  /** Names of any records created by this scenario (for cleanup reporting). */
  createdRecordNames?: string[];
  /** UI identifiers captured during scenario execution. */
  capturedUiIds?: Record<string, string>;
  /** ISO timestamp set after a deletion assertion confirms absence in a refreshed list. */
  deletedAt?: string;
}
