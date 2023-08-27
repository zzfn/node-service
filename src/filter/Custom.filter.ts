import { Catch, MidwayError } from '@midwayjs/core';

@Catch([MidwayError], {
  matchPrototype: true,
})
export class CustomFilter {
  catch(err) {
    return {
      success: false,
      code: err.status,
      message: err.message,
      data: null,
    };
  }
}
