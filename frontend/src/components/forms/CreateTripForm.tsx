import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FormErrorMessage } from "./FormErrorMessage";
import { useAuthStore } from "../../stores/AuthStore";

// MUI imports
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";

export const CreateTripForm = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState("");
  const [numberOfDays, setNumberOfDays] = useState("1");
  const [isPublic, setIsPublic] = useState(true);

  const navigate = useNavigate();

  const accessToken = useAuthStore(state => state.accessToken);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await postNewTrip(); // Awaiting in case we later add logic here (e.g., navigation after successful trip creation)
  };

  const postNewTrip = async () => {
    // Safety check in case token is missing or expired
    if (!accessToken) {
      setErrorMessage("You must be logged in.");
      return;
    }

    setErrorMessage(null);

    if (!destination.trim()) {
      setErrorMessage("Destination is required");
      return;
    }

    setIsLoading(true);

    const url = `${API_URL}/trips`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          tripName,
          destination,
          numberOfDays: Number(numberOfDays),
          isPublic
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || `Request failed with status ${response.status}`);
      }

      // Navigate to the newly created trip's details page
      navigate(`/trips/${data.response._id}`);

    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex justify-center items-center"
      style={{ height: "100vh" }}
    >
      <Card sx={{ width: 600 }}>
        <Stack gap={4}>
          <h2>Create trip</h2>
          <div>
            <FormLabel htmlFor="tripname">Name of the trip</FormLabel>
            <Input
              id="tripname"
              type="text"
              value={tripName}
              placeholder="..."
              onChange={(e) => setTripName(e.target.value)}
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
            <FormLabel htmlFor="destination">Destination</FormLabel>
            <Input
              id="destination"
              type="text"
              value={destination}
              placeholder="Paris"
              required
              onChange={(e) => {
                setDestination(e.target.value);
                setErrorMessage(null);
              }}
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
            <FormLabel htmlFor="days">Amount of days</FormLabel>
            <div className="flex col gap-2">
              <Input
                id="days"
                type="number"
                value={numberOfDays}
                required
                onChange={(e) => {
                  const value = Math.max(1, Number(e.target.value));
                  setNumberOfDays(value.toString());
                }}
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
              <FormHelperText>days</FormHelperText>
            </div>
          </div>

          <div className="flex flex-row items-center gap-2">
            <span className="text-sm font-medium">
              Public
            </span>

            <FormLabel className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="sr-only peer"
              />

              <div className="
                w-12 h-7 bg-gray-300 rounded-full 
                peer-checked:bg-blue-500 
                transition-colors duration-300
                "
              >
              </div>

              <div className="
                absolute top-1 left-1 w-5 h-5 bg-white rounded-full 
                transition-transform duration-300 
                peer-checked:translate-x-5
                "
              >
              </div>
            </FormLabel>
            <span className="text-sm font-medium">
              Private
            </span>
          </div>
          {errorMessage && (
            <FormErrorMessage errorMessage={errorMessage} />
          )}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading}
              size="lg"
              sx={{ width: "40%" }}
            >
              {isLoading ? "Saving.." : "Save"}
            </Button>
          </div>
        </Stack>
      </Card>
    </form>
  );
};