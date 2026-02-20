import { useState, FormEvent } from "react"
import { useNavigate } from "react-router-dom";
import { FormErrorMessage } from "./FormErrorMessage";
import { useAuthStore } from "../../stores/AuthStore";
import { useTripStore } from "../../stores/TripStore";

// MUI imports
import Input from "@mui/joy/Input";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Stack from "@mui/joy/Stack"
import FormLabel from "@mui/joy/FormLabel";
import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";
import Textarea from "@mui/joy/Textarea"

type Props = {
  tripId: string;
  dayId: string;
};

export const CreateActivityForm = ({ tripId, dayId }: Props) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const setUpdateData = useTripStore(state => state.setUpdateData);
  const accessToken = useAuthStore(state => state.accessToken) || undefined;
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // Form data:
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [time, setTime] = useState("");
  const [googleMapLink, setGoogleMapLink] = useState("");


  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    postNewActivity();
    e.currentTarget.reset();
    navigate(`/trips/${tripId}/`);
    setUpdateData();
  };

  const postNewActivity = async () => { 
    const url = `${API_URL}/trips/${tripId}/days/${dayId}/activities`; // Replace with deployed API link 
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          name: name,
          description: description,
          category: category,
          time: time,
          googleMapLink: googleMapLink
        }),
        headers: {
          "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await response.json();
      setError(false);

    } catch (err) { 
      console.error("Sending error:", err);
      setErrorMessage("Could not create new activity");
      setError(true);
    }
  }

  return (
    <form 
      onSubmit={handleSubmit}
      className="flex justify-center items-center"
      style={{ height: "100vh" }}
    >
      <Card sx={{ width: "600px" }}>
        <Stack gap={2}>
          <h2>Create new activity</h2>
          <div>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input 
              id="name" 
              type="text" 
              name="name"
              placeholder="Enter name of activity" 
              required 
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Textarea 
              id="description" 
              name="description"
              placeholder="Enter description of activity" 
              onChange={(e) => setDescription(e.target.value)}
              minRows={3}
            />
          </div>
          <div>
            <FormLabel htmlFor="category">Category</FormLabel>
            <Select
              id="category"
              name="category"
              value={category}
              onChange={(e, value) => setCategory(value ?? "")}  //Special case for MUI Joy Select
              >
              <Option value="" disabled>-- Select an option --</Option>
              <Option value="Culture & Events">Culture & Events</Option>
              <Option value="Sightseeing">Sightseeing</Option>
              <Option value="Food & Drinks">Food & Drinks</Option>
              <Option value="Nature">Nature</Option>
              <Option value="Adventure">Adventure</Option>
              <Option value="Entertainment">Entertainment</Option>
              <Option value="Relaxation">Relaxation</Option>
            </Select>
          </div>
          <div>
            <FormLabel htmlFor="time">Time</FormLabel>
            <Input
              id="time"
              type="time"
              name="time"
              onChange={(e) => setTime(e.target.value)}
        />
          </div>
          <div>
            <FormLabel htmlFor="googleMapLink">Google Map Link</FormLabel>
            <Input 
              id="googleMapLink" 
              type="url"
              name="googleMapLink"
              placeholder="https://www.google.com/maps/..." 
              onChange={(e) => setGoogleMapLink(e.target.value)}
            />
          </div>
          {error && <FormErrorMessage errorMessage={errorMessage} />}
          <div className="flex justify-end">
            <Button 
              type="submit"
              size="lg"
              sx={{ width: "40%" }}
              >
                Save
              </Button>
          </div>
        </Stack>
      </Card>
    </form>
  )
};