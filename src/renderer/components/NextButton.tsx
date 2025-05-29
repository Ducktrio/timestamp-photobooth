import { CSSProperties } from 'react';
import Icon from './Icon';

interface NextButtonProps {
  onClick: () => void;
  label?: string;
  style?: CSSProperties;
  className?: string;
}

export default function NextButton({
  onClick,
  style,
  className,
}: NextButtonProps) {
  const classes = `absolute top-0 right-0 m-8 rounded-full p-4 gap-2 flex flex-row items-center justify-center text-on-surface${className}`;

  return (
    <>
      <div className={classes} style={style} onClick={() => onClick()}>
        <Icon type="right" size="4rem"></Icon>
      </div>
    </>
  );
}
