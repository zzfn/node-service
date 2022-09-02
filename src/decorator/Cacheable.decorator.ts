import { createCustomMethodDecorator } from '@midwayjs/decorator';

export function Cacheable(cacheName: string): MethodDecorator {
  return createCustomMethodDecorator('Cacheable', { cacheName });
}
