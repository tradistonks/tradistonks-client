export interface SymbolSearchResponseDTOResult {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
}

export interface SymbolSearchResponseDTO {
  count: number;
  result: SymbolSearchResponseDTOResult[];
}
