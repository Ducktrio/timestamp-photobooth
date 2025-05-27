import { useEffect, useState } from 'react';
import Frame from 'renderer/interfaces/Frame';
import FrameService from 'renderer/services/FrameService';

export const useFramePreview = (split: boolean) => {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [wide, setWide] = useState<Frame[]>([]);
  const [strip, setStrip] = useState<Frame[]>([]);

  useEffect(() => {
    if (split && strip.length > 0) return;
    if (!split && wide.length > 0) return;
    (async () => {
      await FrameService.getPreview(split)
        .then((value) => {
          split ? setStrip(value as Frame[]) : setWide(value as Frame[]);
        })
        .catch((error) => {
          throw error;
        });
    })();
  }, [split]);

  useEffect(() => {
    setFrames(split ? strip : wide);
  }, [split, wide, strip]);

  return frames;
};
