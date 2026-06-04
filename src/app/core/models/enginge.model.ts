export type EngineStatus = 'started' | 'stopped' | 'drive';

export interface EngineState {
  velocity: number;
  distance: number;
}

export interface DriveResult {
  success: boolean;
}
