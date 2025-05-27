import Frame from "./Frame";
import PaymentCallback from "./PaymentCallback";

export default interface ISessionState {
  phase?: number;
  payment?: PaymentCallback | null;
  frame?: Frame | null;
  canvas?: object | null;
  pictures?: string[] | null;
}
