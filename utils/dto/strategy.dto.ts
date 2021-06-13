export class StrategyDTOFile {
  path!: string;
  content!: string;
}

export class StrategyDTOSymbol {
  name!: string;
  ticker!: string;
  type!: string;
}

export class StrategyDTO {
  _id!: string;

  name!: string;
  language!: string;
  files!: StrategyDTOFile[];

  symbols!: StrategyDTOSymbol[];
}
