import { MidwayError } from '@midwayjs/core';

export class CustomError extends MidwayError {
  constructor(username: string) {
    super(`error password ${username}`);
  }
}
