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
    <div
      className="flex flex-row relative w-full gap-[12rem] snap-x snap-mandatory overflow-x-scroll scrollbar-hide pb-14"
      style={{ scrollbarWidth: 'none' }}
    >
      {Children.count(children) > 3 && (
        <div className="snap-center shrink-0 w-[2rem]"></div>
      )}

      {Children.count(children) <= 3 && (
        <div className="snap-center shrink-0 w-[30rem]"></div>
      )}

      {Children.map(children, (child, index) =>
        cloneElement(child as ReactElement, {
          onClick: () => {
            setSelected(index);
          },

          disabled: index === selected ? true : false,
          className: `flex p-8 rounded-xl w-[20rem] snap-center shrink-0 ${
            index === selected ? 'bg-surface-container-highest' : ''
          }`,
        })
      )}

      {Children.count(children) > 3 && (
        <div className="snap-center shrink-0 w-[2rem]"></div>
      )}
    </div>
  );
}
