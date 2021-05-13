import getConfig from 'next/config';
import axios, { Method } from 'axios';
import query_string from 'query-string';
import { LoginResponseDTO } from '../types/dto/login-response.dto';

const {
  publicRuntimeConfig: { API_EXTERNAL_HOST },
} = getConfig();

type Body =
  | {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    }
  | FormData;

type RequestOptions = {
  body?: Body;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queries?: Record<string, any>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function request<T = any>(
  method: Method,
  url: string,
  options: RequestOptions = {},
): Promise<{
  data: T | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
  status: number;
}> {
  try {
    const queries = query_string.stringify(options.queries ?? {});

    const { data, status } = await axios({
      method,
      url: `${API_EXTERNAL_HOST}${url}?${queries}`,
      data: options.body,
      withCredentials: true,
    });

    return {
      status,
      data,
      error: null,
    };
  } catch (error) {
    return {
      status: error?.response?.status ?? -1,
      data: null,
      error: error?.response?.data?.message ?? 'Unexpected error',
    };
  }
}

export async function login(email: string, password: string) {
  return request<LoginResponseDTO>('POST', '/auth/login', {
    body: {
      email,
      password,
    },
  });
}

export async function register(email: string, username: string, password: string, password_confirmation: string) {
  return request<LoginResponseDTO>('POST', '/users', {
    body: {
      email,
      username,
      password,
      password_confirmation
    },
  });
}