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
  const classes = `${className}`;

  return (
    <>
      <div className={classes} style={style} onClick={() => onClick()}>
        <Icon type="right" size="4rem"></Icon>
      </div>
    </>
  );
}
