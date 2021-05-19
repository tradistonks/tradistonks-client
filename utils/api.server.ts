import axios, { Method } from 'axios';
import { GetServerSidePropsContext } from 'next';
import getConfig from 'next/config';
import queryString from 'query-string';
import { ParsedUrlQuery } from 'querystring';
import { ApiError } from './api-error';
import { AuthCallbackDTO } from './dto/auth-callback.dto';
import { LanguageDTO } from './dto/language.dto';

const {
  serverRuntimeConfig: { API_INTERNAL_HOST },
} = getConfig();

type RequestOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queries?: Record<string, any>;
};

export class ServerSideAPI {
  constructor(private context: GetServerSidePropsContext<ParsedUrlQuery>) {}

  async authLocalCallback(code: string, state: string) {
    return await this.request<AuthCallbackDTO>('POST', '/auth/callback/local', {
      queries: {
        code,
        state,
      },
    });
  }

  async getLanguages() {
    return await this.request<Pick<LanguageDTO, '_id' | 'name'>[]>(
      'GET',
      '/languages',
      {},
    );
  }

  private appendSetCookieHeader(setCookie: string | string[]) {
    const currentSetCookie = this.context.res.getHeader('set-cookie');
    const currentSetCookieAsArray = !currentSetCookie
      ? []
      : Array.isArray(currentSetCookie)
      ? currentSetCookie.toString()
      : [currentSetCookie.toString()];

    const setCookies = Array.isArray(setCookie) ? setCookie : [setCookie];

    this.context.res.setHeader('set-cookie', [
      ...currentSetCookieAsArray,
      ...setCookies,
    ]);

    for (const cookie of setCookies) {
      const [name, data] = cookie.split('=');
      const [value] = data.split(';');

      this.context.req.cookies[name] = value;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async request<T = any>(
    method: Method,
    url: string,
    options: RequestOptions = {},
  ): Promise<T> {
    try {
      const queries = queryString.stringify(options.queries ?? {});

      const { data, headers } = await axios({
        method,
        url: `${API_INTERNAL_HOST}${url}${queries ? `?${queries}` : ''}`,
        data: options.body,
        withCredentials: true,
        headers: {
          Cookie: Object.entries(this.context.req.cookies ?? {})
            .map(([key, value]) => `${key}=${value}`)
            .join(';'),
        },
      });

      if (headers['set-cookie']) {
        this.appendSetCookieHeader(headers['set-cookie']);
      }

      return data;
    } catch (error) {
      throw new ApiError(
        error?.response?.status ?? -1,
        error?.response?.data?.message ?? 'Unexpected error',
      );
    }
  }
}
