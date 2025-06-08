import { useEffect, useState } from 'react';

export default function useFetchCaptures(refresh: any = null) {
  const [srcs, setSrcs] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const data = await window.electron.file.getCaptures();
      console.log(data);

      setSrcs(data);
    })();
  }, [refresh]);

  return srcs;
}
