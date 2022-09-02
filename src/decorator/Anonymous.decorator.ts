import { createCustomMethodDecorator } from '@midwayjs/decorator';

export function Anonymous(): MethodDecorator {
  return createCustomMethodDecorator('Anonymous', {});
}
