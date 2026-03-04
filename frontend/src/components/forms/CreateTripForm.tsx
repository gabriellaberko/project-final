import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FormErrorMessage } from "./FormErrorMessage";
import { useAuthStore } from "../../stores/AuthStore";
import { useTripStore } from "../../stores/TripStore";
import { MainBtn } from "../buttons/MainBtn";
import { PrimaryBtn } from "../buttons/PrimaryBtn";
import { SecondaryBtn } from "../buttons/SecondaryBtn";

// MUI imports
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import Card from "@mui/joy/Card";


export const CreateTripForm = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [destination, setDestination] = useState("");
  const [numberOfDays, setNumberOfDays] = useState("1");
  const [isPublic, setIsPublic] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCustomImage, setIsCustomImage] = useState(false);
  const [isFetchingImages, setIsFetchingImages] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const navigate = useNavigate();
  const accessToken = useAuthStore(state => state.accessToken);
  const fetchCityImages = useTripStore(state => state.fetchCityImages);
  const createTrip = useTripStore(state => state.createTrip);


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await postNewTrip(); // Awaiting in case we later add logic here (e.g., navigation after successful trip creation)
  };

  const handleCustomImageUpload = async (file: File) => {
    if (!accessToken) {
      setErrorMessage("Not authenticated");
      return;
    }

    setIsUploadingImage(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`${API_URL}/uploadImage`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
      const data = await response.json();

      setSelectedImage(data.imageUrl);
      setIsCustomImage(true);
    } catch (err) {
      setErrorMessage("Failed to upload image");
    } finally {
      setIsUploadingImage(false);
    }
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
      destination,
      description,
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
      className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10"
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 600,
          p: 4,
          borderRadius: "10px",
          boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
        }}>
        <Stack gap={4} className="w-full">
          <h2>Create trip</h2>
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
          <div>
            <FormLabel htmlFor="tripdescription">Description of the trip</FormLabel>
            <Input
              id="tripdescription"
              type="text"
              value={description}
              placeholder="Tell us about your travels..."
              onChange={(e) => setDescription(e.target.value)}
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
          <PrimaryBtn
            type="button"
            onClick={handleFetchImages}
            disabled={isFetchingImages}
          >
            {isFetchingImages ? "Loading..." : "Fetch city images"}
          </PrimaryBtn>

          {images.length > 0 && (
            <fieldset className="mt-6">
              <legend className="text-sm font-semibold text-gray-800 mb-2">
                Choose a cover image
              </legend>
              <p className="text-xs text-gray-500 mb-4 ml-0">
                Select one of the suggestions or upload your own image.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => {
                      setSelectedImage(img);
                      setIsCustomImage(false);
                      setLocalPreview(null);
                    }}
                    className={`relative aspect-video w-full rounded-xl overflow-hidden transition-all duration-200 focus:outline-none
                    ${selectedImage === img && !isCustomImage
                        ? "ring-2 ring-blue-600"
                        : "hover:shadow-md hover:scale-[1.02]"
                      }`}
                    aria-pressed={selectedImage === img && !isCustomImage}
                    aria-label={`Select suggested image ${index + 1}`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}

                {/* Upload button */}
                <label
                  htmlFor="customImageUpload"
                  className={`relative aspect-video w-full flex items-center justify-center rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200
                  ${isCustomImage
                      ? "ring-2 ring-blue-600"
                      : "border-gray-300 hover:border-gray-400 hover:shadow-md hover:scale-[1.02]"
                    }`}
                  aria-label="Upload your own image"
                >
                  {localPreview ? (
                    <>
                      <img
                        src={localPreview}
                        alt="Selected custom preview"
                        className="w-full h-full object-cover rounded-xl"
                      />
                      {isUploadingImage && (
                        <div
                          className="absolute inset-0 bg-black/40 flex items-center justify-center"
                          aria-live="polite"
                        >
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="text-sm font-medium text-gray-600">
                      + Upload
                    </span>
                  )}
                </label>

                <input
                  id="customImageUpload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      const previewUrl = URL.createObjectURL(file);
                      setLocalPreview(previewUrl);
                      setIsCustomImage(true);
                      handleCustomImageUpload(file);
                    }
                  }}
                />
              </div>
            </fieldset>
          )}
          <div>
            <FormLabel htmlFor="days">Amount of days</FormLabel>
            <div className="flex flex-wrap items-center gap-2">
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

              <div className={`
                w-12 h-7 rounded-full 
                ${isPublic ? "bg-[#0066D2]" : "bg-gray-300"}
                transition-colors duration-300
                `}
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
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
            <SecondaryBtn
              type="button"
              onClick={() => navigate(-1)}
            >
              Cancel
            </SecondaryBtn>
            <button
              type="submit"
              disabled={isLoading}
              className="btn md:w-40"
            >
              {isLoading ? "Saving.." : "Save"}
            </button>
          </div>
        </Stack>
      </Card>
    </form>
  );
};
