import { useEffect, useState } from 'react';
import Frame from 'renderer/interfaces/Frame';
import FrameService from 'renderer/services/FrameService';

export const useFetchFrames = (
  count: number | null = null,
  themeId: string | null = null,
  split: boolean | null = null
) => {
  const [frames, setFrames] = useState<Frame[]>([]);

  useEffect(() => {
    (async () => {
      await FrameService.getFrames(count, themeId, split)
        .then((value) => {
          setFrames(value as Frame[]);
        })
        .catch((error) => {
          throw error;
        });
    })();
  }, []);

  return frames;
};
