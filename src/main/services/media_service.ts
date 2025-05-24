class MediaService {
  /**
   * @param {string} url - url representation of binary data
   */
  public encoder(url: string) {
    const data = url.replace(/^data:image\/jpeg;base64,/, '');
    return Buffer.from(data, 'base64');
  }

  public saveCanvas(url: string) {
    const data = this.encoder(url);
  }
}
