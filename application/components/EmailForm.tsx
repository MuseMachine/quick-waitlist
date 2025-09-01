"use client";
import React, { useId, useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Hourglass, LoaderCircle } from "lucide-react";
import { useState } from "react";
// import CardFooter from "./Footer";

const EmailForm = ({ date, title }: { date: string; title: string }) => {
  const nameId = useId();
  const emailId = useId();
  const [isPending, startTransaction] = useTransition();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClick = () => {
    setIsLoading(true);
    // Simulate an async operation
    setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Reset after 1 second
  };

  function getDaysLeft(): number {
    const endDate = new Date(date); // Set your target date here
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    const form = new FormData(target);
    const email = form.get("email");
    const fullName = form.get("name") as string;

    if (!email || !fullName) {
      return null;
    }

    // Split full name into first and last name
    const [firstName, ...lastNameParts] = fullName.trim().split(" ");
    const lastName = lastNameParts.join(" ") || ""; // Join remaining parts or empty string

    startTransaction(async () => {
      try {
        const res = await fetch("/api/resend", {
          method: "POST",
          body: JSON.stringify({ email, firstName, lastName }),
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          target.reset();
          toast.success("Thank you for subscribing 🎉");
        } else {
          console.error("Error:", res.status, res.statusText);
          toast.error("Something went wrong");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    });
  };
  return (
    <div className="p-5 space-y-8 flex flex-col justify-center">
      <div className="space-y-3">
        {/* <div className="text-orange-500 font-medium">Limited Time Offer</div> */}
        <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-sm items-center flex gap-1 w-fit">
          <Hourglass size={14} strokeWidth={2} aria-hidden="true" />
          {getDaysLeft()} days left
        </span>
        <h1 className="md:text-4xl text-3xl leading-tight font-semibold">
          {title}
        </h1>
      </div>

      <form onSubmit={(e) => handleSubmit(e)} className="space-y-5">
        <div>
          <Label htmlFor="input-10">Full Name</Label>
          <div className="relative">
            <Input
              type="text"
              name="name"
              id={nameId}
              required
              placeholder="John Doe"
              className="rounded-full"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="input-10">Email address</Label>
          <div className="relative">
            <Input
              type="email"
              name="email"
              id={emailId}
              required
              placeholder="John.Doe@musemachine.de"
              className="rounded-full"
            />
          </div>
        </div>

        <Button
          onClick={handleClick}
          disabled={isPending}
          data-loading={isPending}
          type="submit"
          className="group relative disabled:opacity-100 w-full bg-[#09cd9f] hover:bg-[#03b88e] rounded-full"
        >
          <span className="group-data-[loading=true]:text-transparent text-black font-bold">
            Join the waitlist
          </span>
          {isPending && (
            <div className="absolute inset-0 flex items-center justify-center">
              <LoaderCircle
                className="animate-spin"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
            </div>
          )}
        </Button>
      </form>
      {/*<CardFooter />*/}
    </div>
  );
};

export default EmailForm;
