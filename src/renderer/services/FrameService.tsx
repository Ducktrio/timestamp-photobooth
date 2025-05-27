import API from 'renderer/modules/API';
import Frame from '../interfaces/Frame';
import BoothManager from './BoothManager';

class FrameService {
  private static API = new API(BoothManager.boothId, true);
  /**
   * Get all frames
   * @param {number | null} count? Filter the response to only returns frames with number of pictures equal to count, left null if not needed
   * @param {string | null} themeId? Filter the response to only returns frames associated with the theme, left null if not needed
   * @param {boolean | null} split?: Filter the frames whether they are splitable or not, left null if not needed
   * @return {Promise<Frame[] | void>}
   */
  public static async getFrames(
    count: number | null = null,
    themeId: string | null = null,
    split: boolean | null = null
  ): Promise<Frame[] | void> {
    let url: string = `frames?boothId=${BoothManager.boothId}`;

    if (count) url += `&count=${count}`;
    if (themeId) url += `&themeId=${themeId}`;
    if (split !== null) url += `&split=${split}`;

    return await this.API.get<Frame[]>(url)
      .then((data) => {
        console.log(data);
        return data;
      })
      .catch((error) => {
        throw error;
      });
  }
}

export default FrameService;
