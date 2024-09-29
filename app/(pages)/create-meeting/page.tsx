"use client";
import React, { useEffect, useState } from "react";
import MeetingForm from "./_components/MeetingForm";
import PreviewMeeting from "./_components/PreviewMeeting";
import { useSearchParams } from "next/navigation";
import { app } from "@/config/FirebaseConfig";
import { doc, getDoc, getFirestore } from "firebase/firestore";

interface Event {
  id: string;
  eventName: string;
  duration: number;
  locationType: string;
  locationUrl: string;
  themeColor: string;
}

function CreateMeeting() {
  const [formValue, setFormValue] = useState<any>();
  const searchParams = useSearchParams();
  const db = getFirestore(app);
  const [event, setEvent] = useState<Event | null>(null);

  const fetchMeetingData = async (id: string) => {
    const docRef = doc(db, "MeetingEvent", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setEvent(data as any);
      setFormValue(data);
    }
  };

  useEffect(() => {
    const eventId = searchParams.get("id");
    if (eventId) {
      fetchMeetingData(eventId as string);
    }
  }, [searchParams]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3">
      <div className="shadow-md border h-screen">
        {event ? (
          <MeetingForm
            setFormValue={(v) => setFormValue(v as any)}
            event={event}
          />
        ) : (
          <div>Loading event data...</div>
        )}
      </div>
      <div className="md:col-span-2">
        <PreviewMeeting formValue={formValue} />
      </div>
    </div>
  );
}

export default CreateMeeting;
