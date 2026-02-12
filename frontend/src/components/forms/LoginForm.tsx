import { useState, FormEvent } from "react";
import { FormErrorMessage } from "./FormErrorMessage";
import { useAuthStore } from "../../stores/AuthStore";

export const LoginForm = () => {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Invalid user credentials");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const login = useAuthStore(state => state.login);


  const handleSubmit = (e: FormEvent<HTMLFormElement>) => { 
    e.preventDefault();
    loginUser();
  };

  const loginUser = async () => { 
    const url = `http://localhost:8080//users/login`; // Replace with deployed API link 
    try {

      const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json", 
          },
          body: JSON.stringify({ 
            userName: userName,
            password: password
          }) 
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const loggedInUser = await response.json();
      // Retrieve accessToken from response and login the user
      login({ accessToken: loggedInUser.accessToken, userName: loggedInUser.userName });
      setError(false);

    } catch (err) {
        console.error("Sending error:", error);
        setError(true);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Log in</h2>
      <div>
        <label htmlFor="username">Username:</label>
        <input 
          id="username" 
          type="text" 
          placeholder="Enter username" 
          required 
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Email:</label>
        <input 
          id="password" 
          type="password"
          placeholder="Enter password" 
          required 
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <FormErrorMessage errorMessage={errorMessage} />}
      <button type="submit">Log in</button>
    </form>
  )
};