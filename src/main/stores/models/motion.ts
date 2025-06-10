export class motion {
  constructor(public index: number) {}
  static from(obj: any): motion {
    return new motion(obj.index);
  }
}
