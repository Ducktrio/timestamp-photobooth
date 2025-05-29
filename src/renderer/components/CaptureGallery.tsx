import { CSSProperties } from 'react';
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

  return (
    <>
      <div className={CLASSNAME} style={style}>
        {sources.map((src, index) => (
          <div
            key={index}
            className="flex h-[12rem] w-[24rem] bg-surface-container-high shadow-lg object-cover rounded-xl"
          >
            <LazyImage src={src} className="rounded-xl object-cover" />
          </div>
        ))}
      </div>
    </>
  );
}
