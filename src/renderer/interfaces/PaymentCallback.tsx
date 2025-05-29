interface PaymentCallback {
  /**
   * Transaction status code.
   * Possible values: 200, 201, 202, 400, 404, 406, 500
   * @type {string}
   */
  status_code: string;

  /**
   * Transaction status message
   * @type {string}
   */
  status_message: string;

  /**
   * Merchant's unique payment ID or order ID
   * @type {string}
   */
  order_id: string;

  /**
   * Transaction ID
   * @type {string}
   */
  transaction_id: string;

  /**
   * Timestamp in """yyyy-MM-dd hh:mm:ss""" format
   * @type {string}
   */
  transaction_time: string;

  /**
   * Fraud status. Possible values: """accept""", """deny"""
   * @type {string}
   */
  fraud_status: string;

  /**
   * Bank approval code
   * @type {string}
   */
  approval_code: string;

  /**
   * Acquiring bank
   * @type { string }
   */
  bank: string;
}

export default PaymentCallback;
