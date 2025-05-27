import { useRef, useState, useEffect } from 'react';
import { ImageCache } from 'renderer/utilities/ImageCache';

const LazyImage = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt?: string;
  className?: string;
}) => {
  const [isLoaded, setIsLoaded] = useState(ImageCache.has(src));
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (ImageCache.has(src)) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsLoaded(true);
          ImageCache.add(src);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  return (
    <img
      ref={imgRef}
      src={isLoaded ? src : ''}
      data-src={src}
      alt={alt}
      loading="lazy"
      className={className}
    />
  );
};

export default LazyImage;
