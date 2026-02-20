import { useState, FormEvent } from "react";
import { FormErrorMessage } from "./FormErrorMessage";
import { useAuthStore } from "../../stores/AuthStore";

// MUI imports
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack"
import FormLabel from "@mui/joy/FormLabel";
import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";

export const LoginForm = () => {
  const API_URL = import.meta.env.VITE_API_URL;
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
    const url = `http://localhost:8080/users/login`; // Replace with deployed API link 
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
      <Card sx={{ width: 500 }}>

        <Stack gap={2}>
          <div>
            <FormLabel>Username:</FormLabel>
            <Input
              placeholder="Enter username"
              onChange={(e) => setUserName(e.target.value)}
              sx={{
                '&::before': {
                border: '1.5px solid var(--Input-focusedHighlight)',
                transform: 'scaleX(0)',
                left: '2.5px',
                right: '2.5px',
                bottom: 0,
                top: 'unset',
                transition: 'transform .15s cubic-bezier(0.1,0.9,0.2,1)',
                borderRadius: 0,
                borderBottomLeftRadius: '64px 20px',
                borderBottomRightRadius: '64px 20px',
              },
              '&:focus-within::before': {
                transform: 'scaleX(1)',
              },
            }}
          />
        </div>

        <div>
          <FormLabel>Password:</FormLabel>
          <Input
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              '&::before': {
                border: '1.5px solid var(--Input-focusedHighlight)',
                transform: 'scaleX(0)',
                left: '2.5px',
                right: '2.5px',
                bottom: 0,
                top: 'unset',
                transition: 'transform .15s cubic-bezier(0.1,0.9,0.2,1)',
                borderRadius: 0,
                borderBottomLeftRadius: '64px 20px',
                borderBottomRightRadius: '64px 20px',
              },
              '&:focus-within::before': {
                transform: 'scaleX(1)',
                },
              }}
            />
          </div>

          {error && <FormErrorMessage errorMessage={errorMessage} />}
            <Button size="lg" type="submit">Log in</Button>
        </Stack>
      
      </Card>
    </form>
  )
};