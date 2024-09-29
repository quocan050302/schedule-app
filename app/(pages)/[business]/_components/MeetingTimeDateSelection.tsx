"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format, parse } from "date-fns";
import { CalendarCheck, Clock, LoaderIcon, MapPin, Timer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { app } from "@/config/FirebaseConfig";
import { toast } from "sonner";
import Plunk from "@plunk/node";
import { render } from "@react-email/render";
import Email from "@/emails";
import TimeDateSelection from "./TimeDateSelection";
import UserFormInfo from "./UserFormInfo";

interface MeetingTimeDateSelectionProps {
  eventInfo: EventInfo | null;
  businessInfo: BusinessInfo | null;
}

interface EventInfo {
  id: string;
  duration: number;
  locationUrl?: string;
  locationType?: string;
  eventName?: string;
  themeColor?: string;
}

interface BusinessInfo {
  businessName: string;
  email: string;
  daysAvailable?: Record<string, boolean>;
}

const MeetingTimeDateSelection: React.FC<MeetingTimeDateSelectionProps> = ({
  eventInfo,
  businessInfo,
}) => {
  const [date, setDate] = useState<Date>(new Date());
  const [timeSlots, setTimeSlots] = useState<string[] | undefined>();
  const [enableTimeSlot, setEnabledTimeSlot] = useState<boolean>(true);
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [userName, setUserName] = useState<string | undefined>();
  const [userEmail, setUserEmail] = useState<string | undefined>();
  const [userNote, setUserNote] = useState<string>("");
  const [prevBooking, setPrevBooking] = useState<any[]>([]);
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const db = getFirestore(app);
  const plunk = new Plunk(process.env.NEXT_PUBLIC_PLUNK_API_KEY as string);

  useEffect(() => {
    if (eventInfo?.duration) {
      createTimeSlot(eventInfo.duration);
    }
  }, [eventInfo]);
  console.log("businessInfo", businessInfo);

  const createTimeSlot = (interval: number) => {
    const startTime = 8 * 60;
    const endTime = 22 * 60;
    const totalSlots = (endTime - startTime) / interval;
    const slots = Array.from({ length: totalSlots }, (_, i) => {
      const totalMinutes = startTime + i * interval;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const formattedHours = hours > 12 ? hours - 12 : hours; // Convert to 12-hour format
      const period = hours >= 12 ? "PM" : "AM";
      return `${String(formattedHours).padStart(2, "0")}:${String(
        minutes
      ).padStart(2, "0")} ${period}`;
    });

    console.log(slots);
    setTimeSlots(slots);
  };

  const handleDateChange = (date: Date) => {
    setDate(date);
    const day = format(date, "EEEE");
    if (businessInfo?.daysAvailable?.[day]) {
      getPrevEventBooking(date);
      setEnabledTimeSlot(true);
    } else {
      setEnabledTimeSlot(false);
    }
  };

  const handleScheduleEvent = async () => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!regex.test(userEmail || "")) {
      toast("Enter valid email address");
      return;
    }
    const combinedDateTimeString = `${format(date, "PPP")} ${selectedTime}`;
    const combinedDate = parse(
      combinedDateTimeString,
      "MMMM do, yyyy hh:mm a",
      new Date()
    );
    const unixTimestamp = Math.floor(combinedDate.getTime() / 1000);
    // const now = format(new Date(), "t");
    // console.log("unixTimestamp", unixTimestamp);
    // console.log("TimeNow", new Date(unixTimestamp * 1000));
    // console.log("now", now);

    const docId = Date.now().toString();
    setLoading(true);
    await setDoc(doc(db, "ScheduledMeetings", docId), {
      businessName: businessInfo?.businessName,
      businessEmail: businessInfo?.email,
      selectedTime: selectedTime,
      selectedDate: date,
      formatedDate: format(date, "PPP"),
      formatedTimeStamp: unixTimestamp,
      duration: eventInfo?.duration,
      locationUrl: eventInfo?.locationUrl,
      eventId: eventInfo?.id,
      eventName: eventInfo?.eventName,
      locationType: eventInfo?.locationType,
      color: eventInfo?.themeColor,
      id: docId,
      userName,
      userEmail,
      userNote,
    }).then(() => {
      toast("Meeting Scheduled successfully!");
      sendEmail(userName || "");
    });
  };

  const sendEmail = async (user: string) => {
    try {
      const emailHtml = await render(
        <Email
          businessName={businessInfo?.businessName}
          date={format(date, "PPP").toString()}
          duration={eventInfo?.duration}
          meetingTime={selectedTime}
          meetingUrl={eventInfo?.locationUrl}
          userFirstName={user}
        />
      );
      if (typeof emailHtml !== "string") {
        console.error("Expected emailHtml to be a string, but got:", emailHtml);
        throw new Error("Email body is not a string");
      }
      await plunk.emails
        .send({
          to: userEmail as string,
          subject: "Meeting Schedule Details",
          body: emailHtml,
        })
        .then((resp) => {
          console.log(resp);
          setLoading(false);
          router.replace("/confirmation");
        });
    } catch (error) {
      console.error("Failed to send email:", error);
      setLoading(false);
    }
  };

  const getPrevEventBooking = async (date_: Date) => {
    const q = query(
      collection(db, "ScheduledMeetings"),
      where("selectedDate", "==", date_),
      where("eventId", "==", eventInfo?.id)
    );

    const querySnapshot = await getDocs(q);
    const bookings = querySnapshot.docs.map((doc) => doc.data());
    setPrevBooking(bookings);
  };

  return (
    <div
      className="p-5 py-10 shadow-lg m-5 border-t-8 mx-10 md:mx-26 lg:mx-56 my-10"
      style={{ borderTopColor: eventInfo?.themeColor }}
    >
      <Image src="/logo.svg" alt="logo" width={150} height={150} />
      <div className="grid grid-cols-1 md:grid-cols-3 mt-5">
        <div className="p-4 border-r">
          <h2>{businessInfo?.businessName}</h2>
          <h2 className="font-bold text-3xl">
            {eventInfo?.eventName || "Meeting Name"}
          </h2>
          <div className="mt-5 flex flex-col gap-4">
            <h2 className="flex gap-2">
              <Clock />
              {eventInfo?.duration} Min
            </h2>
            <h2 className="flex gap-2">
              <MapPin />
              {eventInfo?.locationType} Meeting
            </h2>
            <h2 className="flex gap-2">
              <CalendarCheck />
              {format(date, "PPP")}
            </h2>
            {selectedTime && (
              <h2 className="flex gap-2">
                <Timer />
                {selectedTime}
              </h2>
            )}

            <Link href={eventInfo?.locationUrl || "#"} className="text-primary">
              {eventInfo?.locationUrl}
            </Link>
          </div>
        </div>
        {step === 1 ? (
          <TimeDateSelection
            date={date}
            enableTimeSlot={enableTimeSlot}
            handleDateChange={handleDateChange}
            setSelectedTime={setSelectedTime}
            timeSlots={timeSlots as string[]}
            selectedTime={selectedTime}
            prevBooking={prevBooking}
          />
        ) : (
          <UserFormInfo
            setUserName={setUserName}
            setUserEmail={setUserEmail}
            setUserNote={setUserNote}
          />
        )}
      </div>
      <div className="flex gap-3 justify-end">
        {step === 2 && (
          <Button variant="outline" onClick={() => setStep(1)}>
            Back
          </Button>
        )}
        {step === 1 ? (
          <Button
            className="mt-10 float-right"
            disabled={!selectedTime || !date}
            onClick={() => setStep(2)}
          >
            Next
          </Button>
        ) : (
          <Button
            disabled={!userEmail || !userName}
            onClick={handleScheduleEvent}
          >
            {loading ? <LoaderIcon className="animate-spin" /> : "Schedule"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default MeetingTimeDateSelection;
