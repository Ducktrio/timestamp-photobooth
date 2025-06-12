import { AxiosError } from 'axios';
import Booth from 'renderer/interfaces/Booth';
import Frame from 'renderer/interfaces/Frame';
import { FilterPreset } from 'renderer/interfaces/ImageFilter';
import Theme from 'renderer/interfaces/Theme';
import API from 'renderer/modules/API';
import { applyColors } from 'renderer/utilities/ColorGenerator';

type BoothInitResponse = {
  booth: Booth;
  theme: Theme;
  frames: Frame[];
  filters: FilterPreset[];
};
export default class BoothManager {
  public static boothId: string = window.electron.config.BOOTH_TOKEN;
  private static booth: Booth;
  private static theme: Theme;
  private static API = new API(this.boothId!, false);

  private static updateTheme(config: Record<string, string>) {
    applyColors(config);
  }

  static get Theme(): Theme {
    return this.theme;
  }

  static get Booth(): Booth {
    return this.booth;
  }

  /**
   * Startup procedure of a new session
   * apply/reapply theme styling, fetch from server
   */
  public static async boot(): Promise<void> {
    await new Promise((resolve, reject) => {
      this.API.get<BoothInitResponse>('/booths/init')
        .then((data) => {
          this.booth = data.booth;
          this.theme = data.theme;

          this.updateTheme(JSON.parse(data.theme.config));
          resolve(null);
        })
        .catch((error: AxiosError) => {
          reject(error);
        });
    });
    // await window.electron.session.begin();
  }
}
