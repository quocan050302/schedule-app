"use client";
import {
  LogoutLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import React, { useEffect, useRef, useState } from "react";
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
import { useRouter } from "next/navigation";
import firebase from "firebase/compat/app";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import CustomHeader from "./_components/CustomHeader";
import CustomToolbar from "./_components/CustomToolbar";
import CustomContent from "./_components/CustomContent";

interface Meeting {
  businessName?: string;
  formatedDate: string;
  duration: number;
  selectedTime: string;
  locationUrl?: string;
  eventName?: string;
  color?: string;
  formatedTimeStamp: string;
}

function Dashboard() {
  let docRef: firebase.firestore.DocumentReference | null = null;
  const db = getFirestore(app);
  const { user } = useKindeBrowserClient();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [meetingList, setMeetingList] = useState<Meeting[]>([]);
  const calendarRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      isBusinessRegistered();
      getScheduledMeetings();
    }
  }, [user]);

  const isBusinessRegistered = async () => {
    const docRef = doc(db, "Business", user?.email as string);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setLoading(false);
    } else {
      console.log("No such document!");
      setLoading(false);
      router.replace("/create-business");
    }
  };

  const getScheduledMeetings = async () => {
    setMeetingList([]);

    const q = query(
      collection(db, "ScheduledMeetings"),
      where("businessEmail", "==", user?.email)
    );
    const querySnapshot = await getDocs(q);

    const meetings: Meeting[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Meeting;
      console.log(data);
      meetings.push(data);
    });

    setMeetingList(meetings);

    const formattedEvents = formatMeetingsForCalendar(meetings);
    setEvents(formattedEvents);
  };

  const formatMeetingsForCalendar = (meetings: Meeting[]) => {
    return meetings
      .map((meeting) => {
        const { eventName, duration, formatedDate, selectedTime } = meeting;

        const dateWithoutSuffix = formatedDate.replace(
          /(\d+)(st|nd|rd|th)/,
          "$1"
        );
        const validDateString = `${dateWithoutSuffix} ${selectedTime}`;

        const startDateTime = new Date(validDateString);

        if (isNaN(startDateTime.getTime())) {
          return null;
        }

        const endDateTime = new Date(
          startDateTime.getTime() + duration * 60000
        );

        return {
          title: eventName,
          start: startDateTime.toISOString(),
          end: endDateTime.toISOString(),
          theme: meeting?.color,
          locationUrl: meeting?.locationUrl,
        };
      })
      .filter(Boolean);
  };

  const handleEventClick = (info: any) => {
    const locationUrl = info.event.extendedProps.locationUrl;
    if (locationUrl) {
      window.location.href = locationUrl;
    } else {
      alert("No location URL available for this event.");
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-10">Dashboard</h1>
      <CustomToolbar calendarRef={calendarRef} />
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
        initialView="dayGridMonth"
        events={events}
        dayMaxEvents={2}
        eventMaxStack={1}
        headerToolbar={false}
        showNonCurrentDates={false}
        nowIndicator={true}
        eventClick={handleEventClick}
        dayHeaderContent={CustomHeader}
        eventContent={(eventInfo) => (
          <CustomContent eventInfo={eventInfo} calendar={calendarRef} />
        )}
      />
    </div>
  );
}

export default Dashboard;
