import { useState, FormEvent } from "react";
import { FormErrorMessage } from "./FormErrorMessage";
import { useAuthStore } from "../../stores/AuthStore";

// MUI imports
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack"
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import Button from "@mui/joy/Button";
import IconButton from "@mui/joy/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export const SignupForm = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const login = useAuthStore(state => state.login);


  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    postNewUser();
  };

  const postNewUser = async () => {
    const url = `${API_URL}/users/signup`; // Replace with deployed API link 

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
        const errorData = await response.json();
        console.log("Backend error response:", errorData);
        throw new Error(errorData.message || "Signup failed");
      }

      const newUser = await response.json();
      // Retrieve accessToken from response and login the the newly created user
      login({
        accessToken: newUser.accessToken, userName: newUser.userName, userId: newUser.userId,
        avatarUrl: ""
      });
      setError(false);

    } catch (err) {
      console.error("Sending error:", error);
      setErrorMessage("Could not create account");
      setError(true);
    }

  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={3}>
        <div>
          <FormLabel sx={{ mb: 0.5 }}>Username:</FormLabel>
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
          <FormLabel sx={{ mb: 0.5 }}>Email:</FormLabel>
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
          <FormLabel sx={{ mb: 0.5 }}>Password:</FormLabel>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            endDecorator={
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                size="sm"
                variant="plain"
                color="neutral"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            }
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
          <FormHelperText sx={{ mt: 1 }}>ⓘ Password must be at least 8 characters</FormHelperText>
        </div>

        {error && <FormErrorMessage errorMessage={errorMessage} />}
        <Button
          size="lg"
          type="submit"
          sx={{ mt: 2 }}
        >
          Sign up
        </Button>

      </Stack>
    </form>
  )
};