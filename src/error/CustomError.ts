import { MidwayError } from '@midwayjs/core';

export class CustomError extends MidwayError {
  constructor(message: string) {
    super(message);
  }
}
