"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LocationOption from "@/app/_utils/LocationOption";
import ThemeOptions from "@/app/_utils/ThemeOptions";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { app } from "@/config/FirebaseConfig";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";

// Define form schema with zod
const formSchema = z.object({
  eventName: z.string().min(1, "Event name is required"),
  duration: z.number().min(1, "Duration is required"),
  locationType: z.string().min(1, "Location type is required"),
  locationUrl: z.string().url("Location URL must be valid"),
  themeColor: z.string().min(1, "Theme color is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface Event {
  id?: string;
  eventName: string;
  duration: number;
  locationType: string;
  locationUrl: string;
  themeColor: string;
}

interface MeetingFormProps {
  setFormValue: (value: FormValues) => void;
  event?: Event;
}

const MeetingForm: React.FC<MeetingFormProps> = ({ setFormValue, event }) => {
  const { user } = useKindeBrowserClient();
  const db = getFirestore(app);
  const router = useRouter();
  const [locationType, setLocationType] = useState<string>(
    event?.locationType || ""
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: event || {},
  });

  const onCreateClick: SubmitHandler<FormValues> = async (data) => {
    const id = event?.id || Date.now().toString();
    await setDoc(doc(db, "MeetingEvent", id), {
      ...data,
      id: id,
      businessId: doc(db, "Business", user?.email as string),
      createdBy: user?.email,
    });
    toast(event ? "Meeting Event Updated!" : "New Meeting Event Created!");
    router.replace("/dashboard/meeting-type");
  };

  useEffect(() => {
    const subscription = watch((data) => {
      setFormValue(data as FormValues);
    });
    return () => subscription.unsubscribe();
  }, [watch, setFormValue]);

  return (
    <div className="p-8">
      <Link href={"/dashboard"}>
        <h2 className="flex gap-2">
          <ChevronLeft /> Cancel
        </h2>
      </Link>
      <div className="mt-4">
        <h2 className="font-bold text-2xl my-4">
          {event ? "Edit Event" : "Create New Event"}{" "}
        </h2>
        <hr />
      </div>

      <form onSubmit={handleSubmit(onCreateClick)}>
        <div className="flex flex-col gap-3 my-4">
          <h2 className="font-bold">Event Name *</h2>
          <Input
            placeholder="Name of your meeting event"
            {...register("eventName")}
            defaultValue={watch("eventName")} // Use `watch` to display live input
          />
          {errors.eventName && (
            <p className="text-red-500">{errors.eventName.message}</p>
          )}

          <h2 className="font-bold">Duration *</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="max-w-40">
                {watch("duration", event?.duration || 30)} Min{" "}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {[15, 30, 45, 60].map((duration) => (
                <DropdownMenuItem
                  key={duration}
                  onClick={() => setValue("duration", duration)}
                >
                  {duration} Min
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {errors.duration && (
            <p className="text-red-500">{errors.duration.message}</p>
          )}

          <h2 className="font-bold">Location *</h2>
          <div className="grid grid-cols-4 gap-3">
            {LocationOption.map((option, index) => (
              <div
                key={index}
                className={`border flex flex-col justify-center items-center p-3 rounded-lg cursor-pointer hover:bg-blue-100 hover:border-primary ${
                  locationType === option.name && "bg-blue-100 border-primary"
                }`}
                onClick={() => {
                  setLocationType(option.name);
                  setValue("locationType", option.name);
                }}
              >
                <Image
                  src={option.icon}
                  width={30}
                  height={30}
                  alt={option.name}
                />
                <h2>{option.name}</h2>
              </div>
            ))}
          </div>
          {errors.locationType && (
            <p className="text-red-500">{errors.locationType.message}</p>
          )}

          {locationType && (
            <>
              <h2 className="font-bold">Add {locationType} Url *</h2>
              <Input
                placeholder="Add Url"
                {...register("locationUrl")}
                defaultValue={watch("locationUrl", event?.locationUrl)} // Set default value if editing
              />
              {errors.locationUrl && (
                <p className="text-red-500">{errors.locationUrl.message}</p>
              )}
            </>
          )}

          <h2 className="font-bold">Select Theme Color</h2>
          <div className="flex justify-evenly">
            {ThemeOptions.map((color, index) => (
              <div
                key={index}
                className={`h-7 w-7 rounded-full ${
                  watch("themeColor") === color && "border-4 border-black"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setValue("themeColor", color)}
              ></div>
            ))}
          </div>
          {errors.themeColor && (
            <p className="text-red-500">{errors.themeColor.message}</p>
          )}
        </div>

        <Button className="w-full mt-9" disabled={!isValid} type="submit">
          {event ? "Update" : "Create"}{" "}
        </Button>
      </form>
    </div>
  );
};

export default MeetingForm;
