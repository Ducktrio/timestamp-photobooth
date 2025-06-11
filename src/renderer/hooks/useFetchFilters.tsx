import { useEffect, useState } from 'react';
import { FilterPreset } from 'renderer/interfaces/ImageFilter';
import ImageFilterService from 'renderer/services/ImageFilterService';

export default function useFetchFilters() {
  const [filters, setFilters] = useState<FilterPreset[]>([]);

  useEffect(() => {
    (async () => {
      const data = await ImageFilterService.getFilters();

      setFilters(data);
    })();
  }, []);

  return filters;
}
