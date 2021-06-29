export interface RunResultDTOPhase {
  name: string;
  status: number;
  stdout: string;
  stderr: string;
  time: number;
  time_wall: number;
  used_memory: number;
  sandbox_status: string | null;
  csw_voluntary: number;
  csw_forced: number;
}

export interface RunResultDTOOrder {
  type: 'Buy' | 'Sell';
  symbol: string;
  quantity: number;
  timestamp: number;
}

export interface RunResultDTOHistoryCandle {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: number;
}

export interface RunResultDTOConfig {
  timestamp_start: number;
  timestamp_end: number;
  granularity: number;
}

export interface RunResultDTO {
  phases: RunResultDTOPhase[];
  orders?: RunResultDTOOrder[];
  history?: Record<number, Record<string, RunResultDTOHistoryCandle>>;
  config?: RunResultDTOConfig;
  pnl?: Record<number, Record<string, number>>;
}
