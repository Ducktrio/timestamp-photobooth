import React, { createContext, useContext, useState, ReactNode } from "react";

interface PopupContextType {
  showPopup: (content: ReactNode) => void;
  hidePopup: () => void;
  popupContent: ReactNode | null;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const PopupProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [popupContent, setPopupContent] = useState<ReactNode | null>(null);

  const showPopup = (content: ReactNode) => {
    setPopupContent(content);
  };

  const hidePopup = () => {
    setPopupContent(null);
  };

  return (
    <PopupContext.Provider value={{ showPopup, hidePopup, popupContent }}>
      {children}
    </PopupContext.Provider>
  );
};

export const usePopup = (): PopupContextType => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error("usePopup must be used within a PopupProvider");
  }
  return context;
};
