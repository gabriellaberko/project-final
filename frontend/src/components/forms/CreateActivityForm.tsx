import { useState, ChangeEvent, FormEvent } from "react";
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
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
};

export const CreateActivityForm = ({ tripId, dayId, setShowForm }: Props) => {
  const setUpdateData = useTripStore(state => state.setUpdateData);
  const accessToken = useAuthStore(state => state.accessToken) || undefined;
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    time: "",
    googleMapLink: ""
  });


  const handleOnChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    postNewActivity();
    e.currentTarget.reset();
    setShowForm(false);
    setUpdateData();
  };

  const postNewActivity = async () => { 
    const url = `http://localhost:8080/trips/${tripId}/days/${dayId}/activities`; // Replace with deployed API link 
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          time: formData.time,
          googleMapLink: formData.googleMapLink
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
      console.error("Sending error:", error);
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
              onChange={handleOnChange}
            />
          </div>
          <div>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Textarea 
              id="description" 
              name="description"
              placeholder="Enter description of activity" 
              onChange={handleOnChange}
              minRows={3}
            />
          </div>
          <div>
            <FormLabel htmlFor="category">Category</FormLabel>
            <Select
              id="category"
              name="category"
            >
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
            />
          </div>
          <div>
            <FormLabel htmlFor="googleMapLink">Google Map Link</FormLabel>
            <Input 
              id="googleMapLink" 
              type="url"
              name="googleMapLink"
              placeholder="https://www.google.com/maps/..." 
              onChange={handleOnChange}
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