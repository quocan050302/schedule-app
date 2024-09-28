"use client";
// import DaysListInWeek from "@/app/_utils/DaysList";
import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { app } from "@/config/FirebaseConfig";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { toast } from "sonner";

type Day =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

const DaysList: { day: Day }[] = [
  { day: "Sunday" },
  { day: "Monday" },
  { day: "Tuesday" },
  { day: "Wednesday" },
  { day: "Thursday" },
  { day: "Friday" },
  { day: "Saturday" },
];

type DaysAvailable = {
  [key in Day]: boolean;
};

function Availability() {
  const initialDaysAvailable = {
    Sunday: false,
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
  };

  const [daysAvailable, setDaysAvailable] =
    useState<DaysAvailable>(initialDaysAvailable);
  const [startTime, setStartTime] = useState<string | undefined>(undefined);
  const [endTime, setEndTime] = useState<string | undefined>(undefined);
  const db = getFirestore(app);
  const { user } = useKindeBrowserClient();

  useEffect(() => {
    user && getBusinessInfo();
  }, [user]);

  const getBusinessInfo = async () => {
    const docRef = doc(db, "Business", user?.email as string);
    const docSnap = await getDoc(docRef);
    const result = docSnap.data();
    console.log(result);
    if (result) {
      setDaysAvailable(result?.daysAvailable || initialDaysAvailable);
      setStartTime(result?.startTime);
      setEndTime(result?.endTime);
    }
  };

  const onHandleChange = (day: string, value: boolean) => {
    setDaysAvailable((prevDays) => ({
      ...prevDays,
      [day]: value,
    }));
  };

  const handleSave = async () => {
    if (!daysAvailable || typeof daysAvailable !== "object") {
      toast.error("Invalid days available data.");
      return;
    }

    if (!Object.values(daysAvailable).some(Boolean)) {
      toast.error("Please select at least one available day.");
      return;
    }

    if (!startTime) {
      toast.error("Please select a start time.");
      return;
    }

    if (!endTime) {
      toast.error("Please select an end time.");
      return;
    }

    if (startTime >= endTime) {
      toast.error("Start time must be before end time.");
      return;
    }

    const docRef = doc(db, "Business", user?.email as string);
    try {
      await updateDoc(docRef, {
        daysAvailable,
        startTime,
        endTime,
      });
      toast("Change Updated!");
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error("Failed to update availability.");
    }
  };

  return (
    <div className="p-10">
      <h2 className="font-bold text-2xl">Availability</h2>
      <hr className="my-7" />
      <div>
        <h2 className="font-bold">Availability Days</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 my-3">
          {DaysList &&
            DaysList.map((item, index) => (
              <div key={index}>
                <h2 className="flex items-center gap-2">
                  <Checkbox
                    checked={
                      daysAvailable && daysAvailable[item?.day]
                        ? daysAvailable[item?.day]
                        : false
                    }
                    aria-label={item.day}
                    onCheckedChange={(e) =>
                      onHandleChange(item.day, e as boolean)
                    }
                  />
                  {item.day}
                </h2>
              </div>
            ))}
        </div>
      </div>
      <div>
        <h2 className="font-bold mt-10">Availability Time</h2>
        <div className="flex gap-10">
          <div className="mt-3">
            <h2>Start Time</h2>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="mt-3">
            <h2>End Time</h2>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>
      </div>
      <Button className="mt-10" onClick={handleSave}>
        Save
      </Button>
    </div>
  );
}

export default Availability;
