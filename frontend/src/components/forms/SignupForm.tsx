import { useState } from "react";
import { FormErrorMessage } from "./FormErrorMessage";

export const SignupForm = () => {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");


  const handleSubmit = (e) => { 
    e.preventDefault();
    postNewUser();
  };

  const postNewUser = async () => { 
    const url = `http://localhost:8080//users/signup`; // Replace with deployed API link 

    if (password.length < 8) {
      setErrorMessage("Password must be a minimum of 8 characters");
      setError(true);
      return;
    }
    try {
      const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json", 
          },
          body: JSON.stringify({ 
            email: email, 
            userName: userName,
            password: password
          }) 
      });
      
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const newUser = await response.json();
      // Retrieve accessToken from response and login the the newly created user
      login({ accessToken: newUser.accessToken, name: newUser.name });
      setError(false);

    } catch (err) {
        console.error("Sending error:", error);
        setErrorMessage("Could not create account");
        setError(true);
    }

  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign up</h2>
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
        <label htmlFor="email">Email:</label>
        <input 
          id="email" 
          type="email"
          placeholder="Enter email" 
          required 
          onChange={(e) => setEmail(e.target.value)}
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
        <p>ⓘ Password must be at least 8 characters</p>
      </div>
      {error && <FormErrorMessage errorMessage={errorMessage} />}
    </form>
  )
};