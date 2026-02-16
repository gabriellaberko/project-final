import { AuthenticationPage } from "./pages/AuthenticationPage";
import { CreateTripForm } from "./components/forms/CreateTripForm";

// TO DO: Create more pages and implement routing

export const App = () => {

  return (
    <>
      <h1>Welcome to Final Project!</h1>
      <AuthenticationPage />
      <CreateTripForm />
    </>
  );
};
