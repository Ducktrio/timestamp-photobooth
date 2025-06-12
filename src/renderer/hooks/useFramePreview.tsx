import { useEffect, useState } from 'react';
import Frame from 'renderer/interfaces/Frame';
import FrameService from 'renderer/services/FrameService';

export const useFramePreview = (split: boolean) => {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [wide, setWide] = useState<Frame[]>([]);
  const [strip, setStrip] = useState<Frame[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (split && strip.length > 0) return;
    if (!split && wide.length > 0) return;
    (async () => {
      await FrameService.getPreview(split)
        .then((value) => {
          split ? setStrip(value as Frame[]) : setWide(value as Frame[]);
        })
        .catch((error) => {
          const err = new Error(
            `Cannot get frames for preview. Error object: ${error}`
          );
          setError(err);
        });
    })();
  }, [split]);

  useEffect(() => {
    setFrames(split ? strip : wide);
  }, [split, wide, strip]);

  if (error) throw error;
  return frames;
};
