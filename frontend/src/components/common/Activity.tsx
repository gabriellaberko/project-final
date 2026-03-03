import { useState } from "react";
import { useTripStore } from "../../stores/TripStore";
import { useAuthStore } from "../../stores/AuthStore";
import { ActivityInterface } from "../../types/interfaces";
import { ActivityIcon } from "./ActivityIcons"
import { CSS } from "@dnd-kit/utilities"
import { useSortable } from "@dnd-kit/sortable"
import { Trash, Pencil } from "lucide-react"

import Card from "@mui/joy/Card"
import Input from "@mui/joy/Input"
import Textarea from "@mui/joy/Textarea"
import Select from "@mui/joy/Select"
import Option from "@mui/joy/Option"
import Button from "@mui/joy/Button"

interface ActivityPreviewProps {
  activity: ActivityInterface;
}

interface ActivityProps {
  tripId: string;
  dayId: string;
  index: number;
  activity: ActivityInterface;
}

const CATEGORIES = [
  "Culture & Events", 
  "Sightseeing", 
  "Food & Drinks", 
  "Nature", 
  "Adventure", 
  "Entertainment", 
  "Relaxation"
];

export const ActivityPreview = ({ activity }: ActivityPreviewProps) => (
  <Card className="overflow-visible">
    <div className="flex flex-row items-center">
      <div>
        <ActivityIcon
          category={activity.category}
          size={28}
          className="text-blue-600"
        />
      </div>
      <div className="flex flex-col gap-2 p-4 items-start text-left">
        {activity.name && <h4>{activity.name}</h4>}
        {activity.description && <p>{activity.description}</p>}
        {activity.time && <p><b>Time:</b> {activity.time}</p>}
      </div>
    </div>
  </Card>
);

export const Activity = ({ tripId, dayId, index, activity }: ActivityProps) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const accessToken = useAuthStore(state => state.accessToken);
  const userId = useAuthStore(state => state.userId);
  const trip = useTripStore(state => state.trip);
  const removeActivity = useTripStore(state => state.removeActivity);
  const editActivity = useTripStore(state => state.editActivity);

  const isOwner = userId && trip && userId === trip.creator?._id;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: activity.name || "",
    description: activity.description || "",
    time: activity.time || "",
    category: activity.category || "",
    googleMapLink: activity.googleMapLink || ""
  });

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: activity._id,
    data: {
      dayId,
      activityId: activity._id,
      type: "activity",
    },
    disabled: isEditing || !isOwner
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
    zIndex: isDragging ? 50 : "auto",
  }

  const handleSave = async () => {
    try {
      const url = `${API_URL}/trips/${tripId}/days/${dayId}/activities/${activity._id}`;
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        editActivity(tripId, dayId, activity._id, formData);
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async () => {
    try {
      const url = `${API_URL}/trips/${tripId}/days/${dayId}/activities/${activity._id}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (response.ok) {
        removeActivity(tripId, dayId, activity._id)
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (isEditing) {
    return (
      <div
        ref={setNodeRef}
        className="shadow-sm cursor-default"
        style={{ touchAction: "none" }}
      >
        <Card className="overflow-visible">
          <div className="flex flex-col gap-3">
            <Input 
              placeholder="Activity Name" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <Textarea 
              placeholder="Description" 
              minRows={2}
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
            <div className="flex gap-2">
              <Input 
                placeholder="Time" 
                value={formData.time} 
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className="flex-1"
              />
              <Select 
                placeholder="Category" 
                value={formData.category} 
                onChange={(_, newValue) => setFormData({...formData, category: newValue as string})}
                className="flex-1"
              >
                {CATEGORIES.map(cat => (
                  <Option key={cat} value={cat}>{cat}</Option>
                ))}
              </Select>
            </div>
            <Input 
              placeholder="Google Maps Link" 
              value={formData.googleMapLink} 
              onChange={(e) => setFormData({...formData, googleMapLink: e.target.value})}
            />
            <div className="flex justify-end gap-2 mt-2">
              <Button size="sm" variant="soft" color="neutral" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <>
    
    <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={[
          "shadow-sm relative",
          isOwner ? "cursor-grab active:cursor-grabbing" : "cursor-default",
          isDragging ? "opacity-60" : "",
        ].join(" ")}
      >
        <Card>
          <div className="flex flex-row gap-2 self-end absolute top-2 right-2 z-10">
                {isOwner &&
                  <Pencil 
                    size={18}
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsEditing(true)
                    }}
                    className="cursor-pointer text-gray-500 hover:text-blue-600"
                  />
                }
                {isOwner &&
                  <Trash 
                    size={18}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete()
                    }}
                    className="cursor-pointer text-gray-500 hover:text-red-600"
                  />
                }
          </div>
          {/* <div className="flex flex-row justify-between gap-2"> */}
            <div className="flex flex-row items-center">
              <div>
                <ActivityIcon
                  category={activity.category}
                  size={28}
                  className="text-blue-600"
                />
              </div>

              <div className="flex flex-col gap-2 p-4 items-start text-left">
                {activity.name && <h4>{activity.name}</h4>}
                {activity.description && <p>{activity.description}</p>}
                {activity.time && <p><b>Time:</b> {activity.time}</p>}
                {activity.googleMapLink &&
                  <a 
                    href={activity.googleMapLink} 
                    target="_blank" 
                    className="text-sm outline outline-[#837E7E] px-3 py-1 rounded-lg cursor-pointer"
                  >
                    Google Map Link
                  </a>
                }
              </div>
            </div>
            
          {/* </div>          */}
            
        </Card>
      </div>
    </>
  )
}
