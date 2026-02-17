import { useState, FormEvent } from "react";
import { FormErrorMessage } from "./FormErrorMessage";
import { useAuthStore } from "../../stores/AuthStore";

export const CreateTripForm = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState("");
  const [numberOfDays, setNumberOfDays] = useState("1");
  const [isPublic, setIsPublic] = useState(true);

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

    const url = `http://localhost:8080/trips`;

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

      // Reset form
      setTripName("");
      setDestination("");
      setNumberOfDays("1");
      setIsPublic(true);

    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create trip</h2>
      <div>
        <label htmlFor="tripname">Name of the trip</label>
        <input
          id="tripname"
          type="text"
          value={tripName}
          placeholder="..."
          onChange={(e) => setTripName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="destination">Destination</label>
        <input
          id="destination"
          type="text"
          value={destination}
          placeholder="Paris"
          required
          onChange={(e) => {
            setDestination(e.target.value);
            setErrorMessage(null);
          }}
        />
      </div>
      <div>
        <label htmlFor="days">Amount of days</label>
        <input
          id="days"
          type="number"
          value={numberOfDays}
          min="1"
          required
          onChange={(e) => setNumberOfDays(e.target.value)}
        />
        <span>days</span>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">
          Public / Private
        </span>

        <label className="relative inline-flex items-center cursor-pointer">
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
        </label>
      </div>
      {errorMessage && (
        <FormErrorMessage errorMessage={errorMessage} />
      )}
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Saving.." : "Save"}
      </button>
    </form>
  );
};