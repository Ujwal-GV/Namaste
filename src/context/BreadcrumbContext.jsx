import { createContext, useContext, useState } from "react";

const BreadcrumbContext = createContext();

export const BreadcrumbProvider = ({ children }) => {
  const [dynamicLabels, setDynamicLabels] = useState({});

  return (
    <BreadcrumbContext.Provider value={{ dynamicLabels, setDynamicLabels }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const useBreadcrumb = () => useContext(BreadcrumbContext);