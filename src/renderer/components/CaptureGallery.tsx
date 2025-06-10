import { CSSProperties, useEffect, useState } from 'react';
import LazyImage from './LazyImage';

interface CaptureGalleryProps {
  sources: string[];
  className?: string;
  style?: CSSProperties;
}
export default function CaptureGallery({
  sources,
  className = '',
  style,
}: CaptureGalleryProps) {
  const CLASSNAME = `flex flex-row gap-8 overflow-x-scroll scrollbar-hide ${className}`;
  const [srcs, setSrcs] = useState<string[]>([]);

  useEffect(() => {
    setSrcs(sources);
  }, [sources]);

  return (
    <>
      <div className={CLASSNAME} style={style}>
        {srcs.map((src, index) => (
          <div
            key={index}
            className="flex h-[12rem] w-auto bg-surface-container-high shadow-lg object-cover rounded-xl"
          >
            <LazyImage
              src={`file://${src}`}
              className="rounded-xl object-cover"
            />
          </div>
        ))}
      </div>
    </>
  );
}
