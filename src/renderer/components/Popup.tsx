import React, { ReactNode } from 'react';
import { usePopup } from '../contexts/PopupContext';
import Button from './Button';

interface ConfirmPopupProps {
  message: string;
  confirmLabel?: string;
  rejectLabel?: string;
  onConfirm: () => void;
  onReject: () => void;
}

export const ConfirmPopup: React.FC<ConfirmPopupProps> = ({
  message,
  confirmLabel = 'Yes',
  onConfirm,
  rejectLabel = 'No',
  onReject,
}) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content flex flex-col items-center px-[8rem] gap-[4rem]">
        <p className="text-4xl font-medium text-on-surface">{message}</p>
        <div className="mt-4 flex justify-center space-x-4">
          <Button className="px-16" variant="fill" onClick={onReject}>
            {rejectLabel}
          </Button>
          <Button className="px-16" type="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

interface InfoPopupProps {
  message: string;
}

export const InfoPopup: React.FC<InfoPopupProps> = ({ message }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <p>{message}</p>
        <button>Close</button>
      </div>
    </div>
  );
};

interface GenericPopupProps {
  children: ReactNode;
}

export function GenericPopup({ children }: GenericPopupProps) {
  return (
    <div className="popup-overlay">
      <div className="popup-content">{children}</div>
    </div>
  );
}

export const Popup: React.FC = () => {
  const { popupContent, hidePopup } = usePopup();

  if (!popupContent) return null; // Don't render anything if there's no popup content

  // Render different popups based on the content type
  if (React.isValidElement(popupContent)) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
        onClick={hidePopup}
      >
        <div
          className="bg-surface rounded-xl border-4 border-outline p-8 max-h-4xl max-w-4xl w-full relative"
          onClick={(e) => e.stopPropagation()}
        >
          {popupContent}
        </div>
      </div>
    );
  }

  return null;
};
