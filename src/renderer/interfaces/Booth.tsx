export default interface Booth {
  id: string;
  name: string;
  description: string;
  clientKey: string;
  serverKey: string;
  themeId: string;
  frameIds: string[];
}
