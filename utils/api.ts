import axios, { Method } from 'axios';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import getConfig from 'next/config';
import queryString from 'query-string';
import { ParsedUrlQuery } from 'querystring';
import { ConsentResponseDTO } from './dto/consent-response.dto';
import { LoginResponseDTO } from '../utils/dto/login-response.dto';
import { StrategyDTO } from '../utils/dto/strategy.dto';
import { ApiError } from './api-error';
import { AuthCallbackDTO } from './dto/auth-callback.dto';
import { LanguageDTO } from './dto/language.dto';
import { RunResultDTO } from './dto/run-result.dto';
import { UserDTO } from './dto/user.dto';
import { MaybeErrorProps } from './maybe-error-props';

const {
  serverRuntimeConfig: { API_INTERNAL_HOST },
  publicRuntimeConfig: { API_EXTERNAL_HOST },
} = getConfig();

export enum APIConfiguration {
  Internal,
  External,
}

type RequestOptions = {
  body?: Record<string, unknown>;
  queries?: Record<string, unknown>;
};

export abstract class APIBase {
  protected abstract request<T = unknown>(
    method: Method,
    url: string,
    options?: RequestOptions,
  ): Promise<T>;

  async authLocalCallback(code: string, state: string) {
    return await this.request<AuthCallbackDTO>('POST', '/auth/callback/local', {
      queries: {
        code,
        state,
      },
    });
  }

  async register(
    email: string,
    username: string,
    password: string,
    password_confirmation: string,
  ) {
    return this.request<LoginResponseDTO>('POST', '/users', {
      body: {
        email,
        username,
        password,
        password_confirmation,
      },
    });
  }

  async login(email: string, password: string, login_challenge: string) {
    return this.request<LoginResponseDTO>('POST', '/auth/login', {
      body: {
        email,
        password,
        login_challenge,
      },
    });
  }

  async consent(email: string, password: string, consent_challenge: string) {
    return this.request<ConsentResponseDTO>('POST', '/auth/consent', {
      body: {
        email,
        password,
        consent_challenge,
      },
    });
  }

  async getStrategy(strategyId: string) {
    return await this.request<StrategyDTO>('GET', `/strategies/${strategyId}`);
  }

  async createStrategy(data: Omit<StrategyDTO, '_id'>) {
    return this.request<StrategyDTO>('POST', '/strategies', {
      body: data,
    });
  }

  async updateStrategy(id: string, data: Omit<StrategyDTO, '_id'>) {
    return this.request<StrategyDTO>('PUT', `/strategies/${id}`, {
      body: data,
    });
  }

  async runStrategy(id: string) {
    return this.request<RunResultDTO>('POST', `/strategies/${id}/run`);
  }

  async getLanguages() {
    return await this.request<Pick<LanguageDTO, '_id' | 'name'>[]>(
      'GET',
      '/languages',
    );
  }

  async getLanguage(languageId: string) {
    return await this.request<LanguageDTO>('GET', `/languages/${languageId}`);
  }

  async createLanguage(data: Omit<LanguageDTO, '_id'>) {
    return this.request<LanguageDTO>('POST', '/languages', {
      body: data,
    });
  }

  async updateLanguage(id: string, data: Omit<LanguageDTO, '_id'>) {
    return this.request<LanguageDTO>('PUT', `/languages/${id}`, {
      body: data,
    });
  }

  async getUser(username: string) {
    return await this.request<UserDTO>('GET', `/users/${username}`);
  }

  async getCurrentUser() {
    return await this.request<UserDTO>('GET', `/users/me`);
  }

  async getUserStrategies(username: string) {
    return await this.request<StrategyDTO[]>(
      'GET',
      `/users/${username}/strategies`,
    );
  }
}

export class APIInternal extends APIBase {
  constructor(private context: GetServerSidePropsContext<ParsedUrlQuery>) {
    super();
  }

  public errorToServerSideProps<T = unknown>(
    error: unknown,
  ): GetServerSidePropsResult<MaybeErrorProps<T>> {
    return {
      props: {
        error: (error instanceof ApiError
          ? error
          : new ApiError(500, 'Unexpected error')
        ).toObject(),
      },
    };
  }

  public createErrorServerSideProps<T = unknown>(
    status: number,
    message: string,
  ) {
    return this.errorToServerSideProps<T>(new ApiError(status, message));
  }

  protected async request<T = unknown>(
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
}

export class APIExternal extends APIBase {
  public errorToString(error: unknown): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error instanceof Error) {
      return error.message;
    }

    console.error(error);

    return 'An error occured';
  }

  protected async request<T = unknown>(
    method: Method,
    url: string,
    options: RequestOptions = {},
  ): Promise<T> {
    try {
      const queries = queryString.stringify(options.queries ?? {});

      const { data } = await axios({
        method,
        url: `${API_EXTERNAL_HOST}${url}${queries ? `?${queries}` : ''}`,
        data: options.body,
        withCredentials: true,
      });

      return data;
    } catch (error) {
      throw new ApiError(
        error?.response?.status ?? -1,
        error?.response?.data?.message ?? 'Unexpected error',
      );
    }
  }
}
