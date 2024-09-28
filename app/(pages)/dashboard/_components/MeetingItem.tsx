"use client";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Presentation } from "lucide-react";
import React, { useEffect, useState } from "react";
import { app } from "@/config/FirebaseConfig";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { addMinutes, format, isSameDay, parse } from "date-fns";
import MeetingSkel from "@/app/_skeletons/MeetingSkel";

interface Meeting {
  formatedDate: string;
  duration: number;
  selectedTime: string;
  locationUrl?: string;
  eventName?: string;
  formatedTimeStamp?: string;
}

interface MeetingItemProps {
  selectedDate?: Date;
}

const MeetingItem = ({ selectedDate }: MeetingItemProps) => {
  const db = getFirestore(app);
  const { user } = useKindeBrowserClient();
  const [meetingList, setMeetingList] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      getScheduledMeetings();
    }
  }, [user]);

  const getScheduledMeetings = async () => {
    setLoading(true);
    setMeetingList([]);

    try {
      const q = query(
        collection(db, "ScheduledMeetings"),
        where("businessEmail", "==", user?.email)
      );
      const querySnapshot = await getDocs(q);

      const meetings: Meeting[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Meeting;
        meetings.push(data);
      });
      setMeetingList(meetings);
    } finally {
      setLoading(false);
    }
  };

  const convertSelectedDateIntoSecond = selectedDate
    ? selectedDate.getTime() / 1000
    : null;

  const checkIsSameDay = (selectedDate: string, formatedDate: string) => {
    const parsedFormatedDate = parse(formatedDate, "MMMM do, yyyy", new Date());

    const result = isSameDay(selectedDate, parsedFormatedDate);
    return result;
  };

  const filterMeetingList = (type: "upcoming" | "expired"): Meeting[] => {
    const now = format(new Date(), "t");
    if (type === "upcoming") {
      return meetingList.filter((item) => {
        console.log(item?.formatedDate);
        return (
          item.formatedTimeStamp &&
          convertSelectedDateIntoSecond &&
          item.formatedTimeStamp >= now &&
          checkIsSameDay(selectedDate as any, item?.formatedDate)
        );
      });
    } else {
      return meetingList.filter(
        (item) => item.formatedTimeStamp && item.formatedTimeStamp < now
      );
    }
  };

  const getTimeRange = (selectedTime: string, duration: number): string => {
    const parseTimeString = (timeString: string) => {
      const [time, modifier] = timeString.split(" ");
      let [hours, minutes] = time.split(":").map(Number);

      if (modifier === "PM" && hours !== 12) {
        hours += 12;
      } else if (modifier === "AM" && hours === 12) {
        hours = 0;
      }

      const date = new Date();
      date.setHours(hours, minutes, 0, 0);

      return date;
    };

    const startTime = parseTimeString(selectedTime);
    const endTime = addMinutes(startTime, duration);

    const formattedStartTime = format(startTime, "hh:mm a");
    const formattedEndTime = format(endTime, "hh:mm a");

    return `${formattedStartTime} to ${formattedEndTime}`;
  };

  const upcomingEvent = filterMeetingList("upcoming");

  return (
    <div>
      {loading ? (
        <MeetingSkel />
      ) : (
        <ul className="max-h-64 overflow-scroll">
          {upcomingEvent.length > 0 ? (
            upcomingEvent.map(
              (meeting, index) =>
                index < 3 && (
                  <li
                    key={index}
                    className="py-4 px-6 bg-white rounded-sm relative overflow-hidden mb-4"
                  >
                    <div className="absolute left-0 top-0 h-full w-[6px] bg-primary"></div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col w-[70%] gap-2">
                        <span className="text-lg text-darkBlue font-medium leading-[1.3]">
                          {meeting?.eventName}
                        </span>
                        <span className="text-sm text-darkBlue/60">
                          {getTimeRange(
                            meeting?.selectedTime,
                            meeting?.duration
                          )}
                        </span>
                      </div>
                      <div className="p-2 rounded-full cursor-pointer text-white bg-primary hover:opacity-80">
                        <Presentation />
                      </div>
                    </div>
                  </li>
                )
            )
          ) : (
            <div className="p-2 bg-white shadow-md text-primary text-center">
              No events occurred
            </div>
          )}
        </ul>
      )}
    </div>
  );
};

export default MeetingItem;
