"use client";
import { Button } from "@/components/ui/button";
import { app } from "@/config/FirebaseConfig";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { Clock, Copy, MapPin, Pen, Settings, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useRouter } from "next/navigation";
import MeetingEvent from "@/app/_skeletons/MeetingEvent";
interface Event {
  id: string;
  eventName: string;
  duration: number;
  locationType: string;
  themeColor?: string;
}

interface BusinessInfo {
  businessName?: string;
}

interface MeetingEventListProps {
  searchQuery: string;
}

const MeetingEventList: React.FC<MeetingEventListProps> = ({ searchQuery }) => {
  const db = getFirestore(app);
  const { user } = useKindeBrowserClient();
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [eventList, setEventList] = useState<Event[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      getEventList();
      BusinessInfo();
    }
  }, [user]);

  const getEventList = async () => {
    setLoading(true);
    setEventList([]);

    const q = query(
      collection(db, "MeetingEvent"),
      where("createdBy", "==", user?.email)
    );

    try {
      const querySnapshot = await getDocs(q);
      const events: Event[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Event;
        events.push(data);
      });
      setEventList(events);
    } catch (error) {
      console.error("Error fetching events: ", error);
    } finally {
      setLoading(false);
    }
  };

  const BusinessInfo = async () => {
    if (user?.email) {
      const docRef = doc(db, "Business", user.email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBusinessInfo(docSnap.data() as BusinessInfo);
      }
    }
  };

  const onDeleteMeetingEvent = async (event: Event) => {
    await deleteDoc(doc(db, "MeetingEvent", event.id)).then(() => {
      toast("Meeting Event Deleted!");
      getEventList();
    });
  };

  const onEditMeetingEvent = (event: Event) => {
    const query = {
      id: event.id,
    };

    const queryString = new URLSearchParams(query as any).toString();

    router.push(`/create-meeting?${queryString}`);
  };

  const onCopyClickHandler = (event: Event) => {
    const meetingEventUrl =
      process.env.NEXT_PUBLIC_BASE_URL +
      "/" +
      businessInfo?.businessName +
      "/" +
      event.id;
    navigator.clipboard.writeText(meetingEventUrl);
    toast("Copied to Clipboard");
  };

  const filteredEvents = eventList.filter((event) =>
    event.eventName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="">
      {loading ? (
        <div className="grid grid-cols-12 gap-4 mt-4">
          <div className="col-span-4">
            <MeetingEvent />
          </div>
          <div className="col-span-4">
            <MeetingEvent />
          </div>
          <div className="col-span-4">
            <MeetingEvent />
          </div>
          <div className="col-span-4">
            <MeetingEvent />
          </div>
          <div className="col-span-4">
            <MeetingEvent />
          </div>
          <div className="col-span-4">
            <MeetingEvent />
          </div>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredEvents?.length > 0 ? (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className="border shadow-md border-t-8 rounded-lg p-5 flex flex-col gap-3"
                style={{ borderTopColor: event.themeColor }}
              >
                <div className="flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Settings className="cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        className="flex gap-2"
                        onClick={() => onEditMeetingEvent(event)}
                      >
                        <Pen /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex gap-2"
                        onClick={() => onDeleteMeetingEvent(event)}
                      >
                        <Trash /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <h2 className="font-medium text-xl line-clamp-2">
                  {event.eventName}
                </h2>
                <div className="flex justify-between mt-auto">
                  <h2 className="flex gap-2 text-gray-500">
                    <Clock /> {event.duration} Min
                  </h2>
                  <h2 className="flex gap-2 text-gray-500">
                    <MapPin /> {event.locationType}
                  </h2>
                </div>
                <div className="flex justify-between border-t-[1px] border-primary pt-4 mt-2">
                  <h2
                    className="flex gap-2 text-sm text-primary items-center cursor-pointer"
                    onClick={() => onCopyClickHandler(event)}
                  >
                    <Copy className="h-4 w-4" /> Copy Link
                  </h2>
                  <Button
                    variant="outline"
                    className="rounded-full text-primary border-primary"
                  >
                    Share
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <h2>No events found</h2>
          )}
        </div>
      )}
    </div>
  );
};

export default MeetingEventList;
