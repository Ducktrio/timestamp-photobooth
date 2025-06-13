import {
  Children,
  cloneElement,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import LoadingAnimation from './LoadingAnimation';

interface SelectorProps {
  children: ReactNode;
  onSelected: (index: number) => void;
  defaultIndex?: number;
  reset?: any;
}

export default function Selector({
  children,
  onSelected,
  defaultIndex,
  reset,
}: SelectorProps) {
  const [selected, setSelected] = useState<number>(
    defaultIndex ? defaultIndex : -1
  );

  useEffect(() => {
    onSelected(selected);
  }, [selected]);
  useEffect(() => {
    setSelected(defaultIndex ? defaultIndex : -1);
  }, [reset]);

  if (Children.count(children) <= 0)
    return (
      <div className="w-[20rem] p-8 h-[24rem] flex justify-center">
        <LoadingAnimation className="mx-auto relative " />
      </div>
    );

  return (
    <div className="relative max-w-[72rem] flex gap-32 snap-x snap-mandatory overflow-x-auto pb-14 scrollbar">
      <div className="snap-center shrink-0">
        <div className="shrink-0 w-[18rem]"></div>
      </div>

      {Children.map(children, (child, index) =>
        cloneElement(child as ReactElement, {
          onClick: () => {
            setSelected(index);
          },

          disabled: index === selected ? true : false,
          className: `flex p-8 rounded-xl w-80 snap-center shrink-0 ${
            index === selected ? 'bg-surface-container-highest' : ''
          }`,
        })
      )}

      <div className="snap-center shrink-0">
        <div className="shrink-0 w-[18rem]"></div>
      </div>
    </div>
  );
}
