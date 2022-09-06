import { PageVo } from './PageVo';

export function page2sql(pageVo: PageVo) {
  const { current = 1, pageSize = 10 } = pageVo;
  return {
    skip: (current - 1) * pageSize,
    take: pageSize,
  };
}
