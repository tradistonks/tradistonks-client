import { ApiErrorBase } from './api-error';

export type MaybeErrorProps<T = Record<string, never>> = Readonly<
  | T
  | {
      error: ApiErrorBase;
    }
>;

export function hasErrorProps<T>(props: MaybeErrorProps<T>): props is Readonly<{
  error: ApiErrorBase;
  [key: string]: unknown;
}> {
  return !!(props as never)['error'];
}
