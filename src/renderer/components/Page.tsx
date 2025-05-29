import { CSSProperties, ReactNode } from 'react';

interface PageProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  fullscreen?: boolean;
}

/**
 * Page wrapper for consistent Page layout
 * @params {string} className - apply HTML element class attribute
 */
export default function Page({
  children,
  className = '',
  style,
  fullscreen = false,
}: PageProps) {
  const styles = `min-h-lvh max-h-lvh flex text-on-surface ${
    fullscreen ? '' : 'p-[4rem]'
  } ${className}`;

  return (
    <div className={styles} style={style}>
      {children}
    </div>
  );
}
