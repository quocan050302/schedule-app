"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScheduledMeetingList from "./_components/ScheduledMeetingList";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { app } from "@/config/FirebaseConfig";
import { format } from "date-fns";

interface Meeting {
  formatedDate: string;
  duration: number;
  selectedTime: string;
  locationUrl?: string;
  formatedTimeStamp?: string;
}

function ScheduledMeeting() {
  const db = getFirestore(app);
  const { user } = useKindeBrowserClient();
  const [meetingList, setMeetingList] = useState<Meeting[]>([]);

  useEffect(() => {
    if (user) {
      getScheduledMeetings();
    }
  }, [user]);

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
  };

  const filterMeetingList = (type: "upcoming" | "expired"): Meeting[] => {
    const now = format(new Date(), "t");
    if (type === "upcoming") {
      return meetingList.filter(
        (item) => item.formatedTimeStamp && item.formatedTimeStamp >= now
      );
    } else {
      return meetingList.filter(
        (item) => item.formatedTimeStamp && item.formatedTimeStamp < now
      );
    }
  };

  return (
    <div className="p-4 mt-4">
      <div className="bg-slate-50 p-4">
        <h2 className="text-3xl text-primary font-bold mb-12">
          Scheduled Meetings
        </h2>
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            <ScheduledMeetingList
              meetingList={filterMeetingList("upcoming") as Meeting[]}
            />
          </TabsContent>
          <TabsContent value="expired">
            <ScheduledMeetingList meetingList={filterMeetingList("expired")} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ScheduledMeeting;
