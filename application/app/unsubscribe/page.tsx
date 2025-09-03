"use client";

import { Button } from "@/components/ui/button";
import React, { useTransition } from "react";
// import { useSearchParams } from "next/navigation";

const UnsubscribePage = () => {
  const [isPending, startTransaction] = useTransition();
  // const searchParams = useSearchParams();
  // const email = searchParams.get("email");
  // console.log("email:", email);
  const handleSubmit = () => {
    startTransaction(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN}/api/resend`,
          {
            method: "POST",
            body: JSON.stringify(""),
            headers: { "Content-Type": "application/json" },
          },
        );

        if (res.ok) {
          const result = await res.json();
          console.log(result);
        } else {
          console.error("Error:", res.status, res.statusText);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    });
  };
  return (
    <section className="w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2">
      <div className="max-w-screen-lg mx-auto relative">
        <div className="flex flex-col items-center p-4 md:p-12">
          <div className="text-center mb-4 lg:mb-6">
            <h1 className="text-3xl md:text-[55px] font-semibold leading-none md:leading-tight">
              We are sorry to see you go
            </h1>
            <p className="text-3xl md:text-sm font-semibold leading-none md:leading-tight">
              Please click the unsubscribe button to recieve a confirmation
              e-mail.
            </p>
          </div>

          {/* form to unsubscribe */}

          <Button
            onClick={handleSubmit}
            className="bg-[#09cd9f] text-black font-bold px-2.5 py-1.5 rounded-full text-base transition-all duration-200 hover:bg-[#03b88e]"
          >
            Unsubscribe
          </Button>
        </div>
      </div>
    </section>
  );
};

export default UnsubscribePage;
