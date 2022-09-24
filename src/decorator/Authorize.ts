import { createCustomMethodDecorator } from '@midwayjs/decorator';

export function Authorize(onlyAdmin = true): MethodDecorator {
  return createCustomMethodDecorator('Authorize', { onlyAdmin });
}
