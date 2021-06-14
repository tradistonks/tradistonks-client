export class StrategyDTOFile {
  path!: string;
  content!: string;
}

export class StrategyDTOSymbol {
  name!: string;
  ticker!: string;
  type!: string;
}

export type StrategySymbolsCandlesGranularity =
  | '1'
  | '5'
  | '15'
  | '30'
  | '60'
  | 'D'
  | 'W'
  | 'M';

export class StrategyDTO {
  _id!: string;

  name!: string;
  language!: string;
  files!: StrategyDTOFile[];

  symbols!: StrategyDTOSymbol[];

  symbols_candles_granularity!: StrategySymbolsCandlesGranularity;

  from!: Date;
  to?: Date;

  updated_date?: Date;
  created_date?: Date;
}
