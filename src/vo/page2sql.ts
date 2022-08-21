import { PageVo } from './PageVo';

export function page2sql(pageVo: PageVo) {
  return {
    skip: (pageVo.current - 1) * pageVo.pageSize,
    take: pageVo.pageSize,
  };
}
