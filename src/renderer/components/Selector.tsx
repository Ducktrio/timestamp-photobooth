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
  reset?: any;
}

export default function Selector({
  children,
  onSelected,
  reset,
}: SelectorProps) {
  const [selected, setSelected] = useState<number>(-1);

  useEffect(() => {
    onSelected(selected);
  }, [selected]);
  useEffect(() => {
    setSelected(-1);
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
      <div className="snap-center shrink-0 w-[20rem] p-8"></div>

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
      <div className="p-8 rounded-xl w-[20rem] snap-center shrink-0">
        <span className="h-[24rem]"> </span>
      </div>
    </div>
  );
}
