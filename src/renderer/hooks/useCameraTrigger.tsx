import { useState } from 'react';

export default function useCameraTrigger() {
  const [capturing, setCapturing] = useState(false);

  const trigger = async () => {
    try {
      setCapturing(true);

      console.log('TRIGGER');
      await window.electron.camera.capture();
      console.log("Should've triggered");
    } catch (error) {
      throw error;
    } finally {
      setCapturing(false);
    }
  };

  return { trigger, capturing };
}
