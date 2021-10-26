import { HttpStatus } from './http-status';

export interface StatusError extends Error {
  code: HttpStatus;
}

export class HttpError extends Error implements StatusError {
  code: HttpStatus = HttpStatus.BAD_REQUEST;
  constructor(code: HttpStatus, message: string) {
    super(message);
    this.code = code;
  }

  get name(): string {
    return `Http Error ${this.code}`;
  }

  get stack(): string {
    return this.message;
  }
}
