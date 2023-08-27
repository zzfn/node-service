import { createCustomMethodDecorator } from '@midwayjs/core';

export function Cacheable(cacheName: string): MethodDecorator {
  return createCustomMethodDecorator('Cacheable', { cacheName });
}
