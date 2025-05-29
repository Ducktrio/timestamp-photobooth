export default interface PaymentErrorCallback {
  /**
   * Transaction status code, possible values: 200, 201, 202, 400, 404, 406, 500
   * @type { number }
   */
  status_code: string;

  /**
   * Transaction status message in an array
   */
  status_message: string[];
}
