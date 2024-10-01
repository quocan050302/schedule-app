"use client";
import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { app } from "@/config/FirebaseConfig";
import MeetingTimeDateSelection from "../_components/MeetingTimeDateSelection";

interface SharedMeetingEventProps {
  params: {
    business: string;
    meetingEventId: string;
  };
}

interface BusinessInfo {
  businessName: string;
}

interface EventInfo {
  eventName: string;
}

const SharedMeetingEvent: React.FC<SharedMeetingEventProps> = ({ params }) => {
  const db = getFirestore(app);

  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [eventInfo, setEventInfo] = useState<EventInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (params) {
      getMeetingBusinessAndEventDetails();
    }
  }, [params]);
  console.log("params", params);
  const getMeetingBusinessAndEventDetails = async () => {
    setLoading(true);

    const q = query(
      collection(db, "Business"),
      where("businessName", "==", params.business)
    );

    try {
      const docSnap = await getDocs(q);
      docSnap.forEach((doc) => {
        setBusinessInfo(doc.data() as BusinessInfo);
      });

      const docRef = doc(db, "MeetingEvent", params?.meetingEventId);
      const result = await getDoc(docRef);
      setEventInfo(result.data() as EventInfo);
    } catch (error) {
      console.error("Error fetching meeting details:", error);
    } finally {
      setLoading(false);
    }
  };
  console.log("businessInfo", businessInfo);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <MeetingTimeDateSelection
          eventInfo={eventInfo as any}
          businessInfo={businessInfo as any}
        />
      )}
    </div>
  );
};

export default SharedMeetingEvent;
