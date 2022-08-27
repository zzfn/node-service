import { createCustomMethodDecorator } from '@midwayjs/decorator';

export function Anonymous(): MethodDecorator {
  console.log(11111);
  return createCustomMethodDecorator('Anonymous', {}, false);
}
