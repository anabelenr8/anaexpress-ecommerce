import React, { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext();


export const AppProvider = ({ children }) => {
  const [dataVersion, setDataVersion] = useState(0);

  // This will force consumers to reload data when called
  const refreshData = useCallback(() => {
    setDataVersion(prev => prev + 1);
  }, []);

  return (
    <AppContext.Provider value={{ dataVersion, refreshData }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

export { AppContext }; 