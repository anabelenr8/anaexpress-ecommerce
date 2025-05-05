import { useCallback, useState } from 'react';

const useRefreshData = () => {
  const [dataVersion, setDataVersion] = useState(0);

  const refreshData = useCallback(() => {
    setDataVersion((prev) => prev + 1);
  }, []);

  return { dataVersion, refreshData };
};

export default useRefreshData;
