export interface ApiErrorBase {
  status: number;

  message: string;
}

export class ApiError extends Error implements ApiErrorBase {
  constructor(public status: number, public message: string) {
    super(message);
  }

  toObject() {
    return {
      status: this.status,
      message: this.message,
    };
  }
}
