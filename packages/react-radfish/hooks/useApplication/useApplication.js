import { createContext, useContext } from "react";

export const ApplicationContext = createContext(null);

export const useApplication = () => {
  const application = useContext(ApplicationContext);
  
  if (!application) {
    throw new Error("useApplication must be used within an ApplicationProvider");
  }
  
  return application;
};
