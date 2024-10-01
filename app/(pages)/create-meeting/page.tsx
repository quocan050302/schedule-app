"use client";
import React, { Suspense, useEffect, useState } from "react";
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
  const [formValue, setFormValue] = useState<any>(null);
  const searchParams = useSearchParams();
  const db = getFirestore(app);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMeetingData = async (id: string) => {
    setLoading(true);
    const docRef = doc(db, "MeetingEvent", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setEvent(data as any);
      setFormValue(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    const eventId = searchParams.get("id");
    if (eventId) {
      fetchMeetingData(eventId as string);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  return (
    <Suspense fallback={null}>
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="shadow-md border h-screen">
          {loading ? (
            <div>Loading event data...</div>
          ) : (
            <MeetingForm
              setFormValue={(v) => setFormValue(v as any)}
              event={event || undefined}
            />
          )}
        </div>
        <div className="md:col-span-2">
          <PreviewMeeting formValue={formValue} />
        </div>
      </div>
    </Suspense>
  );
}

export default CreateMeeting;
