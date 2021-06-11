export class StrategyDTOFile {
  path!: string;
  content!: string;
}

export class StrategyDTO {
  _id!: string;

  name!: string;
  language!: string;
  files!: StrategyDTOFile[];
}
