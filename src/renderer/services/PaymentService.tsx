import axios from 'axios';

const api = axios.create({
  baseURL: 'https://timestamp.fun/api',
  headers: {
    Token: window.electron.config.BOOTH_TOKEN,
  },
});
export default class PaymentService {
  /**
   * Handle payment transaction, requesting backend for payment
   * @params {string} frameId - the Id number for the frame to be paid
   * @params {number} quantity  - numbers of frames to be printed
   * @returns {Promise<string|void>} will return a string of token for payment embed key, else thrown error
   *
   */
  public static async pay(
    frameId: string,
    quantity: number
  ): Promise<string | void> {
    await api
      .post('/transactions', {
        FrameId: frameId,
        quantity: quantity,
      })
      .then((response) => {
        return response.data.token;
      })
      .catch((error) => {
        throw error;
      });
  }
}
