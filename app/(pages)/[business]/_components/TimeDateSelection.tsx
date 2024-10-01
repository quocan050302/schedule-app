import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { isBefore, startOfDay } from "date-fns";
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
  businessInfo: any;
}

const TimeDateSelection: React.FC<TimeDateSelectionProps> = ({
  date,
  handleDateChange,
  timeSlots,
  setSelectedTime,
  enableTimeSlot,
  selectedTime,
  prevBooking,
  businessInfo,
}) => {
  const checkTimeSlot = (time: string): boolean => {
    return prevBooking.filter((item) => item.selectedTime === time).length > 0;
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
  const availableDays = businessInfo?.daysAvailable
    ? Object.keys(businessInfo.daysAvailable).filter(
        (day) => businessInfo.daysAvailable[day] === true
      )
    : [];

  const dayNamesToNumbers = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const isAvailableDay = (date: Date) => {
    const dayOfWeek = date.getDay();
    const today = startOfDay(new Date());
    const selectedDay = startOfDay(date);

    const isFutureOrToday = !isBefore(selectedDay, today);

    const dayOfWeekString = Object.keys(dayNamesToNumbers).find(
      (key) =>
        dayNamesToNumbers[key as keyof typeof dayNamesToNumbers] === dayOfWeek
    ) as keyof typeof dayNamesToNumbers;

    const isAvailableDayOfWeek = availableDays.includes(dayOfWeekString);

    return isAvailableDayOfWeek && isFutureOrToday;
  };

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
          modifiers={{
            available: (date) => isAvailableDay(date),
          }}
          modifiersClassNames={{
            available: "bg-green-200 text-green-800",
          }}
        />
        <div className="flex items-center gap-2 mt-4">
          <div className="w-5 h-5 bg-green-200 rounded-sm"></div>
          <div className="text-sm">Available Day</div>
        </div>
      </div>
      <div
        className="flex flex-col w-full overflow-auto gap-4 p-5"
        style={{ maxHeight: "400px" }}
      >
        {timeSlots?.map((time) => (
          <Button
            key={time}
            disabled={
              !enableTimeSlot || checkTimeSlot(time) || isTimeSlotDisabled(time)
            }
            onClick={() => {
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
