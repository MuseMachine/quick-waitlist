"use client";
import { Hourglass, LoaderCircle } from "lucide-react";
import type React from "react";
import { useId, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EmailForm = ({ date, title }: { date: string; title: string }) => {
  const nameId = useId();
  const emailId = useId();
  const checkboxId = useId();
  const [isPending, startTransaction] = useTransition();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleClick = () => {
    setIsLoading(true);
    // Simulate an async operation
    setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Reset after 1 second
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    const form = new FormData(target);
    const email = form.get("email");
    const name = form.get("name") as string;
    const checkBoxState = form.get("checkbox") as string;
    if (!email || !name || !checkBoxState) {
      return null;
    }

    // Split full name into first and last name
    const [firstName, ...lastNameParts] = name.trim().split(" ");
    const lastName = lastNameParts.join(" ") || ""; // Join remaining parts or empty string

    startTransaction(async () => {
      try {
        const res = await fetch("/api/subscribe", {
          method: "POST",
          body: JSON.stringify({ firstName, lastName, email }),
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
    <div className="py-5 space-y-8 flex flex-col justify-center">

      <form onSubmit={(e) => handleSubmit(e)} className="space-y-5">
        <div>
          <div className="relative">
            <Input
              type="text"
              name="name"
              id={nameId}
              required
              placeholder="Full name"
              className="rounded-full placeholder:text-[#CFCFCF] text-[#F5F5F5]"
            />
          </div>
        </div>
        <div>
          <div className="relative">
            <Input
              type="email"
              name="email"
              id={emailId}
              required
              placeholder="Your email address"
              className="rounded-full placeholder:text-[#CFCFCF] text-[#F5F5F5] focus:boder-red-500"
            />
          </div>
        </div>
        <div className="flex gap-2 px-4">
          <Input
            name="checkbox"
            id={checkboxId}
            type="checkbox"
            className="relative size-4 content-between top-0.5 flex-shrink-0"
            required
          />
          <Label className="leading-5">
            I&apos;ve read the{" "}
            <a
              href="https://musemachine.ai/en/privacy-policy"
              className="underline hover:no-underline"
            >
              privacy policy&nbsp;
            </a>
            and agree that my email address will be stored and processed for the
            purpose of maintaining the waiting list.
          </Label>
        </div>
        <Button
          onClick={handleClick}
          disabled={isPending}
          data-loading={isPending}
          type="submit"
          className="group relative disabled:opacity-100 w-full rounded-full"
        >
          <span className="group-data-[loading=true]:text-transparent text-black text-lg font-medium">
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
    </div>
  );
};

export default EmailForm;
