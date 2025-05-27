import React, {
  createContext,
  MutableRefObject,
  useContext,
  useRef,
  useState,
} from 'react';
import Frame from 'renderer/interfaces/Frame';
import PaymentCallback from 'renderer/interfaces/PaymentCallback';

interface DataContextValue {
  frame: Frame | null;
  setFrame: (frame: Frame) => void;

  payment: PaymentCallback | null;
  setPayment: (payment: PaymentCallback) => void;

  quantity: number;
  setQuantity: (qty: number) => void;

  canvas: string | null;
  saveCanvas: (canvasState: string) => void;

  scaleFactor: number;
  setScaleFactor: (factor: number) => void;

  pictures: string[];
  setPictures: (sources: string[]) => void;

  originalWidth: MutableRefObject<number>;
  originalHeight: MutableRefObject<number>;

  aspectRatio: MutableRefObject<number>;

  reset: () => void;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [frame, setFrame] = useState<Frame | null>(null);
  const [payment, setPayment] = useState<PaymentCallback | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [canvas, saveCanvas] = useState<string | null>(null);
  const [scaleFactor, setScaleFactor] = useState<number>(0);
  const [pictures, setPictures] = useState<string[]>([]);

  const originalWidth = useRef<number>(1000);
  const originalHeight = useRef<number>(1000);
  const aspectRatio = useRef<number>(1);

  const reset = () => {
    setFrame(null);
    setPayment(null);
    setQuantity(0);
    setScaleFactor(1);
    saveCanvas(null);
    setPictures([]);
    originalHeight.current = 1000;
    originalWidth.current = 1000;
    aspectRatio.current = 1;
  };

  return (
    <DataContext.Provider
      value={{
        frame,
        setFrame,
        payment,
        setPayment,
        quantity,
        setQuantity,
        canvas,
        saveCanvas,
        scaleFactor,
        setScaleFactor,
        pictures,
        setPictures,
        originalHeight,
        originalWidth,
        aspectRatio,
        reset,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const sessionData = (): DataContextValue => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('sessionData must be used within a DataProvider');
  }
  return context;
};
