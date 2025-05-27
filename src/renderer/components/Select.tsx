/**
 * Custom <select> input
 *
 *
 *
 */

import { useEffect, useState } from 'react';
import { usePopup } from '../contexts/PopupContext';
import { GenericPopup } from './Popup';

type optionType = string | number | boolean;

type SelectProps = {
  options: { value: optionType; label: optionType }[];
  className?: string;
  onChange: (value: string | number | boolean) => void;
  value: string | number | boolean;
  label?: string;
};

export default function Select({
  options = [],
  className = '',
  onChange,
  value,
  label = 'Select',
}: SelectProps) {
  const [selected, setSelected] = useState<{
    value: optionType;
    label: optionType;
  }>({
    value: options[0]?.value,
    label: options[0]?.label,
  });
  const { showPopup, hidePopup } = usePopup();

  const handleClick = () => {
    showPopup(
      <GenericPopup>
        <div className="flex items-center justify-center my-12">
          <span className="text-4xl">{label}</span>
        </div>
        <div className="flex flex-row gap-4 justify-evenly">
          {options.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                setSelected(item);
                hidePopup();
              }}
              className={`py-12 px-24 bg-surface-container-lowest rounded shadow-xl border border-outline
text-on-primary-container items-center text-4xl
${
  item.value === selected.value
    ? '!bg-primary-container !text-on-primary-container !shadow-none border-8 border-primary'
    : ''
}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </GenericPopup>
    );
  };

  useEffect(() => {
    onChange(selected.value);
  }, [selected]);

  return (
    <>
      <div
        onClick={handleClick}
        className={`px-8 py-2 flex flex-row items-center rounded-full border border-primary bg-primary-container w-fit ${className}`}
      >
        <span className="flex-none pr-4">{label ? label : value}</span>

        <div className="flex-1 border-l border-on-primary-container pl-4 relative">
          <span>{selected.label}</span>
        </div>
      </div>
    </>
  );
}
