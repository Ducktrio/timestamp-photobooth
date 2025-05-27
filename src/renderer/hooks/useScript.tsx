import { useEffect } from "react";

/**
 * Custom hook to create script tag and append to HTML upon rendering
 * This is necessary since how React works.
 * @returns in return, this remove the script tag
 */
const useScript = (src: string, attributes?: Record<string, string>) => {
  useEffect(() => {
    if (document.querySelector(`script[src="${src}"]`)) {
      return;
    }
    const script = document.createElement("script");

    script.src = src;
    script.async = true;

    if (attributes)
      Object.entries(attributes).forEach(([key, value]) => {
        script.setAttribute(key, value);
      });

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [src, attributes]);
};

export default useScript;
