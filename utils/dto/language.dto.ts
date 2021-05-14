export interface LanguageFilesDTO {
  path: string;
  content: string;
}

export interface LanguageDTO {
  _id: string;

  name: string;

  monaco_identifier: string;

  compile_script: string;

  run_script: string;

  files: LanguageFilesDTO[];
}
