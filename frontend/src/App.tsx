import { useEffect } from "react";
import { useAuthStore } from "./stores/AuthStore";


// TO DO: Create more pages and implement routing

export const App = () => {

  const checkAuthStatus = useAuthStore(state => state.checkAuthStatus);
  
  useEffect(() => { 
    checkAuthStatus();
  }, [checkAuthStatus])

  return (
    <>
      <h1>Welcome to Final Project!</h1>
    </>
  );
};
