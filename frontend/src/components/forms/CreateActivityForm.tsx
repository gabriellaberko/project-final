import { useState, ChangeEvent, FormEvent } from "react";
import { FormErrorMessage } from "./FormErrorMessage";
import { useAuthStore } from "../../stores/AuthStore";


type Props = {
  tripId: string;
  dayId: string;
};

export const CreateActivityForm = ({ tripId, dayId }: Props) => {
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


  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  postNewActivity();
  e.currentTarget.reset();
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
    <form onSubmit={handleSubmit}>
      <h2>Create new activity</h2>
      <div>
        <label htmlFor="name">Name</label>
        <input 
          id="name" 
          type="text" 
          name="name"
          placeholder="Enter name of activity" 
          required 
          onChange={handleOnChange}
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <input 
          id="description" 
          type="text"
          name="description"
          placeholder="Enter description of activity" 
          onChange={handleOnChange}
        />
      </div>
      <div>
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
        >
          <option>Culture & Events</option>
          <option>Sightseeing</option>
          <option>Food & Drinks</option>
          <option>Nature</option>
          <option>Adventure</option>
          <option>Entertainment</option>
          <option>Relaxation</option>
        </select>
      </div>
      <div>
        <label htmlFor="time">Time</label>
        <input
          id="time"
          type="time"
          name="time"
        />
      </div>
      <div>
        <label htmlFor="googleMapLink">Google Map Link</label>
        <input 
          id="googleMapLink" 
          type="url"
          name="googleMapLink"
          placeholder="https://www.google.com/maps/..." 
          onChange={handleOnChange}
        />
      </div>
      {error && <FormErrorMessage errorMessage={errorMessage} />}
      <button type="submit">Add activity</button>
    </form>
  )
};