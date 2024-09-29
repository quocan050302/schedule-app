import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CalendarCheck, Clock, Timer } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { addMinutes, format } from "date-fns";

interface Meeting {
  formatedDate: string;
  duration: number;
  selectedTime: string;
  locationUrl?: string;
  eventName?: string;
  color?: string;
  formatedTimeStamp?: string;
}

interface ScheduledMeetingListProps {
  meetingList: Meeting[];
}

const ScheduledMeetingList: React.FC<ScheduledMeetingListProps> = ({
  meetingList,
}) => {
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
  return (
    <div className="p-4 ">
      <div className="flex flex-col grid-cols-9 p-2 mx-auto md:grid">
        {meetingList &&
          meetingList.map((meeting, index) => (
            <React.Fragment key={index}>
              {index % 2 === 0 ? (
                <div className="flex md:contents flex-row-reverse">
                  <div
                    style={{
                      borderLeftColor: meeting?.color,
                    }}
                    className="w-[308px] border-l-8 relative p-4 my-6 text-gray-800 bg-white rounded-xl col-start-1 col-end-5 mr-auto md:mr-0 md:ml-auto"
                  >
                    <h3 className="text-lg font-semibold lg:text-xl">
                      {meeting?.eventName}
                    </h3>
                    <p className="mt-2 leading-6">
                      {getTimeRange(meeting?.selectedTime, meeting?.duration)}
                    </p>
                    <span className="absolute text-sm text-darkBlue -top-7 left-2 whitespace-nowrap">
                      {meeting.formatedDate}
                    </span>
                  </div>
                  <div className="relative col-start-5 col-end-6 mr-7 md:mx-auto">
                    <div className="flex items-center justify-center w-6 h-full">
                      <div className="w-1 h-full bg-indigo-300 rounded-t-full bg-gradient-to-b from-indigo-400 to-indigo-300"></div>
                    </div>
                    <div className="absolute w-6 h-6 -mt-3 bg-white border-4 border-indigo-400 rounded-full top-1/2"></div>
                  </div>
                </div>
              ) : (
                <div className="flex md:contents">
                  <div className="relative col-start-5 col-end-6 mr-7 md:mx-auto">
                    <div className="flex items-center justify-center w-6 h-full">
                      <div className="w-1 h-full bg-indigo-300"></div>
                    </div>
                    <div className="absolute w-6 h-6 -mt-3 bg-white border-4 border-indigo-400 rounded-full top-1/2"></div>
                  </div>
                  <div
                    style={{
                      borderLeftColor: meeting?.color,
                    }}
                    className="w-[308px] border-l-8 relative p-4 my-6 text-gray-800 bg-white rounded-xl col-start-6 col-end-10 mr-auto"
                  >
                    <h3 className="text-lg font-semibold lg:text-xl">
                      {meeting?.eventName}
                    </h3>
                    <p className="mt-2 leading-6">
                      {getTimeRange(meeting?.selectedTime, meeting?.duration)}
                    </p>
                    <span className="absolute text-sm text-darkBlue -top-7 left-2 whitespace-nowrap">
                      {meeting.formatedDate}
                    </span>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
      </div>
    </div>
  );
};

export default ScheduledMeetingList;
