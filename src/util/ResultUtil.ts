export class ResultUtil {
  static success(response) {
    return { success: true, code: 0, message: 'OK', data: response };
  }
  static error(message) {
    return { success: false, code: -1, message: message, data: null };
  }
}
