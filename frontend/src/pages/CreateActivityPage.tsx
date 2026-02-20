import { CreateActivityForm } from "../components/forms/CreateActivityForm";
import { useParams } from "react-router-dom";

export const CreateActivityPage = () => {
  const { tripId, dayId } = useParams<{
    tripId: string;
    dayId: string;
  }>(); // Retrieve trip ID & day ID from the url
  
  if (!tripId || !dayId) {
    return <div>Invalid URL</div>;
  }

  return < CreateActivityForm tripId={tripId!} dayId={dayId!} />;
};