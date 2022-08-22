import { createCustomMethodDecorator } from '@midwayjs/decorator';

export function Anonymous(): MethodDecorator {
  // 我们传递了一个可以修改展示格式的参数
  return createCustomMethodDecorator("Anonymous", { },false);
}
