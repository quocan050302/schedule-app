import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import React from "react";
import { DayClickEventHandler } from "react-day-picker";

interface TimeDateSelectionProps {
  date: Date;
  handleDateChange: (date: Date) => void;
  timeSlots: string[];
  setSelectedTime: (time: string) => void;
  enableTimeSlot: boolean;
  selectedTime: string | undefined;
  prevBooking: { selectedTime: string }[];
}

const TimeDateSelection: React.FC<TimeDateSelectionProps> = ({
  date,
  handleDateChange,
  timeSlots,
  setSelectedTime,
  enableTimeSlot,
  selectedTime,
  prevBooking,
}) => {
  const checkTimeSlot = (time: string): boolean => {
    return prevBooking.filter((item) => item.selectedTime === time).length > 0;
  };
  console.log("setPrevBooking", prevBooking);

  return (
    <div className="md:col-span-2 flex px-4">
      <div className="flex flex-col">
        <h2 className="font-bold text-lg">Select Date & Time</h2>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d: Date | undefined) => d && handleDateChange(d)}
          className="rounded-md border mt-5"
          disabled={(date) => date <= new Date()}
        />
      </div>
      <div
        className="flex flex-col w-full overflow-auto gap-4 p-5"
        style={{ maxHeight: "400px" }}
      >
        {timeSlots?.map((time) => (
          <Button
            key={time}
            disabled={!enableTimeSlot || checkTimeSlot(time)}
            // onClick={() => setSelectedTime(time)}
            onClick={() => {
              console.log(`Button clicked: ${time}`);
              setSelectedTime(time);
            }}
            className={`border-primary text-primary ${
              time === selectedTime && "bg-primary text-white"
            }`}
            variant="outline"
          >
            {time}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TimeDateSelection;
