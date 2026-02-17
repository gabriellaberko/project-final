import { useState, FormEvent } from "react";
import { FormErrorMessage } from "./FormErrorMessage";
import { useAuthStore } from "../../stores/AuthStore";

// MUI imports
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack"
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";

export const SignupForm = () => {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = useAuthStore(state => state.login);


  const handleSubmit = (e: FormEvent<HTMLFormElement>) => { 
    e.preventDefault();
    postNewUser();
  };

  const postNewUser = async () => { 
    const url = `http://localhost:8080/users/signup`; // Replace with deployed API link 

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
      login({ accessToken: newUser.accessToken, userName: newUser.userName });
      setError(false);

    } catch (err) {
        console.error("Sending error:", error);
        setErrorMessage("Could not create account");
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
            <FormLabel>Email:</FormLabel>
            <Input
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
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
            <FormHelperText>ⓘ Password must be at least 8 characters</FormHelperText>
            </div>
        
          {error && <FormErrorMessage errorMessage={errorMessage} />}
          <Button size="lg" type="submit">Sign up</Button>

        </Stack>
      
      </Card>
    </form>
  )
};