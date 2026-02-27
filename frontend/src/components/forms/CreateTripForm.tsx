import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FormErrorMessage } from "./FormErrorMessage";
import { useAuthStore } from "../../stores/AuthStore";
import { useTripStore } from "../../stores/TripStore";

// MUI imports
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";

export const CreateTripForm = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState("");
  const [numberOfDays, setNumberOfDays] = useState("1");
  const [isPublic, setIsPublic] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCustomImage, setIsCustomImage] = useState(false);
  const [isFetchingImages, setIsFetchingImages] = useState(false);

  const navigate = useNavigate();
  const fetchCityImages = useTripStore(state => state.fetchCityImages);
  const createTrip = useTripStore(state => state.createTrip);


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await postNewTrip(); // Awaiting in case we later add logic here (e.g., navigation after successful trip creation)
  };

  const postNewTrip = async () => {
    setErrorMessage(null);

    if (!destination.trim()) {
      setErrorMessage("Destination cannot be empty.");
      return;
    }

    if (!selectedImage) {
      setErrorMessage("Please select or upload an image");
      return;
    }

    setIsLoading(true);

    const tripId = await createTrip({
      tripName,
      destination,
      numberOfDays: Number(numberOfDays),
      isPublic,
      imageUrl: selectedImage,
      isCustomImage,
    });

    if (tripId) {
      navigate(`/trips/${tripId}`);
    } else {
      setErrorMessage("Failed to create trip. Please try again.");
    }
    setIsLoading(false);
  };

  const handleFetchImages = async () => {
    if (!destination.trim()) {
      setErrorMessage("Please enter a destination to fetch images.");
      return;
    }
    setIsFetchingImages(true);
    const fetchedImages = await fetchCityImages(destination);
    if (fetchedImages) {
      setImages(fetchedImages);
      setSelectedImage(null); // Reset selected image when fetching new ones
      setIsCustomImage(false);
    } else {
      setErrorMessage("Failed to fetch images. Please try again.");
    }
    setIsFetchingImages(false);
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
                setImages([]);
                setSelectedImage(null);
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
          <Button
            type="button"
            onClick={handleFetchImages}
            loading={isFetchingImages}
            sx={{ mt: 1 }}
          >
            Fetch city images
          </Button>
          {images.length > 0 && (
            <div className="flex gap-3 mt-3">
              {images.map((img) => (
                <img
                  key={img}
                  src={img}
                  alt="city option"
                  onClick={() => {
                    setSelectedImage(img);
                    setIsCustomImage(false);
                  }}
                  className={`w-28 h-20 object-cover rounded-md cursor-pointer border-2 ${selectedImage === img
                    ? "border-blue-500"
                    : "border-transparent"
                    }`}
                />
              ))}
            </div>
          )}
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
              Private
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
              Public
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