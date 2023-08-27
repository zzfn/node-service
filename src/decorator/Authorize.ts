import { createCustomMethodDecorator } from '@midwayjs/core';

export function Authorize(onlyAdmin = true): MethodDecorator {
  return createCustomMethodDecorator('Authorize', { onlyAdmin });
}
