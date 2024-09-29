import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Clock, MapPin } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

// Define types for form values and component props
interface FormValue {
  eventName?: string;
  duration?: number;
  locationType?: string;
  locationUrl?: string;
  themeColor?: string;
}

interface PreviewMeetingProps {
  formValue: FormValue | null;
}

const PreviewMeeting: React.FC<PreviewMeetingProps> = ({ formValue }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  useEffect(() => {
    if (formValue?.duration) {
      createTimeSlot(formValue?.duration);
    }
  }, [formValue]);

  const createTimeSlot = (interval: number) => {
    const startTime = 8 * 60;
    const endTime = 22 * 60;
    const totalSlots = Math.floor((endTime - startTime) / interval);
    const slots = Array.from({ length: totalSlots }, (_, i) => {
      const totalMinutes = startTime + i * interval;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const formattedHours = hours > 12 ? hours - 12 : hours;
      const period = hours >= 12 ? "PM" : "AM";
      return `${String(formattedHours).padStart(2, "0")}:${String(
        minutes
      ).padStart(2, "0")} ${period}`;
    });

    setTimeSlots(slots);
  };

  const isTimeSlotDisabled = (time: string) => {
    const [timeString, period] = time.split(" ");
    const [hours, minutes] = timeString.split(":").map(Number);
    let slotDate = new Date(date);
    let slotHours = period === "PM" && hours !== 12 ? hours + 12 : hours;
    slotDate.setHours(slotHours, minutes);

    const nowPlusOneHour = new Date();
    nowPlusOneHour.setHours(nowPlusOneHour.getHours() + 1);

    return slotDate <= nowPlusOneHour;
  };

  return (
    <div
      className="p-5 py-10 shadow-lg m-5 border-t-8"
      style={{ borderTopColor: formValue?.themeColor || "#000" }}
    >
      <div className="text-3xl no-underline text-blue-700 font-sans font-bold max-[430px]:text-[20px]">
        Byte<span className="text-green-800">Webster</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-5">
        <div className="p-4 border-r">
          <h2>Business Name</h2>
          <h2 className="font-bold text-3xl">
            {formValue?.eventName ? formValue.eventName : "Meeting Name"}
          </h2>
          <div className="mt-5 flex flex-col gap-4">
            <h2 className="flex gap-2">
              <Clock />
              {formValue?.duration} Min
            </h2>
            <h2 className="flex gap-2">
              <MapPin />
              {formValue?.locationType} Meeting
            </h2>
            <Link
              href={formValue?.locationUrl || "#"}
              className="text-primary line-clamp-2 flex"
            >
              {formValue?.locationUrl || "Add Location URL"}
            </Link>
          </div>
        </div>
        <div className="md:col-span-2 flex px-4">
          {/* <div className="flex flex-col">
            <h2 className="font-bold text-lg">Select Date & Time</h2>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate as any}
              className="rounded-md border mt-5"
              disabled={(day: Date) => day <= new Date()}
            />
          </div> */}
          {/* <div
            className="flex flex-col w-full overflow-auto gap-4 p-5"
            style={{ maxHeight: "400px" }}
          >
            {timeSlots?.map((time, index) => (
              <Button
                key={index}
                className="border-primary text-primary"
                variant="outline"
                disabled={isTimeSlotDisabled(time)}
              >
                {time}
              </Button>
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default PreviewMeeting;
