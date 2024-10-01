"use client";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Mail, Notebook, Presentation } from "lucide-react";
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
import Link from "next/link";

interface Meeting {
  formatedDate: string;
  duration: number;
  selectedTime: string;
  locationUrl?: string;
  eventName?: string;
  color?: string;
  formatedTimeStamp?: string;
  userName?: string;
  userEmail?: string;
  userNote?: string;
}

interface MeetingItemProps {
  selectedDate?: Date;
}

const MeetingItem = ({ selectedDate }: MeetingItemProps) => {
  const db = getFirestore(app);
  const { user } = useKindeBrowserClient();
  const [meetingList, setMeetingList] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<Meeting | null>(null);
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

  const checkIsSameDay = (
    selectedDate: Date | undefined,
    formatedDate: string
  ) => {
    const parsedFormatedDate = parse(formatedDate, "MMMM do, yyyy", new Date());

    const result = isSameDay(selectedDate as Date, parsedFormatedDate);
    return result;
  };

  const filterMeetingList = (type: "upcoming" | "expired"): Meeting[] => {
    const now = format(new Date(), "t");
    if (type === "upcoming") {
      return meetingList.filter((item) => {
        return (
          item.formatedTimeStamp &&
          //   convertSelectedDateIntoSecond &&
          item.formatedTimeStamp >= now &&
          checkIsSameDay(selectedDate as Date | undefined, item?.formatedDate)
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

  const handleViewProfileClick = (meeting: Meeting) => {
    setSelectedClient(meeting);
    setModal(true);
    document.body.classList.add("overflow-hidden");
  };

  const closeModal = () => {
    setModal(false);
    setSelectedClient(null);
    document.body.classList.remove("overflow-hidden");
  };
  const getInitials = (fullName: string) => {
    const nameParts = fullName.trim().split(" ");
    const initials = nameParts
      .filter((part, index) => index === 0 || index === nameParts.length - 1)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
    return initials;
  }
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
                    style={{
                      backgroundColor: `${meeting?.color}33`,
                    }}
                    className={`py-4 px-6 rounded-sm relative overflow-hidden mb-4`}
                  >
                    <div
                      style={{
                        background: meeting?.color,
                      }}
                      className={`absolute left-0 top-0 h-full w-[6px]`}
                    ></div>
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
                      <Link
                        href={meeting?.locationUrl as string}
                        className="p-2 rounded-full cursor-pointer text-white bg-primary hover:opacity-80"
                      >
                        <Presentation />
                      </Link>
                    </div>
                    <div
                      onClick={() => handleViewProfileClick(meeting)}
                      className="flex items-center gap-4 mt-2 cursor-pointer"
                    >
                      <span
                        style={{
                          background: meeting?.color,
                        }}
                        className="text-center w-10 h-10 flex items-center justify-center text-[18px] text-white rounded-full "
                      >
                        {getInitials(meeting?.userName as string)}
                      </span>
                      <span className="text-[16px] cursor-pointer text-blue-700 underline">
                        View client profile
                      </span>
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
      {modal && selectedClient && (
        <div>
          <div className="fixed  top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white z-[101] p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Client Profile</h2>
              <button
                className="py-1 px-[10px] bg-red-500 text-white rounded hover:bg-red-600"
                onClick={closeModal}
              >
                X
              </button>
            </div>
            <div className="text-center my-4">
              <div
                style={{
                  background: selectedClient?.color,
                }}
                className="h-32 w-32 text-[32px] font-semibold flex items-center justify-center text-white bg-[#F9BE81] rounded-full border-4 border-white dark:border-gray-800 mx-auto my-4"
              >
                {getInitials(selectedClient?.userName as string)}
              </div>
              <div className="py-2 flex flex-col">
                <h3 className="font-bold text-2xl text-gray-800 text-center mb-2">
                  {selectedClient?.userName}
                </h3>
                <div className="flex justify-start items-start flex-col gap-2 bg-[#eaeffb]/50 p-3 rounded-sm">
                  <div className="text-[20px] pb-2 border-b border-b-gray-200 flex items-center justify-between w-full gap-2 font-medium text-gray-700 ">
                    <span>Email</span>
                    <span className="text-right">
                      {selectedClient?.userEmail}
                    </span>
                  </div>
                  <div className="text-[20px] flex items-center justify-between w-full gap-2 font-medium text-gray-700 ">
                    <span>Note</span>
                    <span className="text-right">
                      {selectedClient?.userNote}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            onClick={closeModal}
            className="fixed z-[100] inset-0 flex items-center justify-center bg-black bg-opacity-50"
          ></div>
        </div>
      )}
    </div>
  );
};

export default MeetingItem;
