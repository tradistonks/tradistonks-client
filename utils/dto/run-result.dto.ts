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

export interface RunResultDTO {
  phases: RunResultDTOPhase[];
  orders?: RunResultDTOOrder[];
}
