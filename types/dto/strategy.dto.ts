export class StrategyDTOFile {
  path!: string;

  content!: string;
}

export class StrategyDTO {
  name!: string;

  language!: string;

  files!: StrategyDTOFile[];
}
