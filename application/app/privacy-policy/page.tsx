import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import MMLogo from "@/components/Logo";
import { Button } from "@/components/ui/button";

const PrivacyPolicyPage = () => {
  return (
    <section className="w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <div className="w-1/4 h-25 mx-auto object-contain mb-5 text-[#09cd9f]">
        <MMLogo />
      </div>
      <div className="max-w-screen-lg border-[1.5px] border-[#F0E4D2] mx-auto relative">
        <div className="flex flex-col items-center p-4 md:p-12">
          <div className="text-center mb-4 lg:mb-6">
            <h1 className="text-xl md:text-[30px] font-semibold leading-none md:leading-tight">
              Privacy Policy
            </h1>
          </div>
          <p className="text-black/70 font-normal mb-6">
            {process.env.NEXT_PUBLIC_PRIVACY || "Add Privacy Policy From ENV"}
          </p>
          <Link href="/">
            <Button variant="link">
              <ChevronLeft
                className="me-1 opacity-60"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
              Go back
            </Button>
          </Link>
        </div>
        {/* element */}
        <span className="w-2 h-2 absolute z-10 -top-[1%] -left-[0.5%] block bg-white border border-[#F0E4D2]"></span>
        <span className="w-2 h-2 absolute z-10 -bottom-[1%] -left-[0.5%] block bg-white border border-[#F0E4D2]"></span>
        <span className="w-2 h-2 absolute z-10 -top-[1%] -right-[0.5%] block bg-white border border-[#F0E4D2]"></span>
        <span className="w-2 h-2 absolute z-10 -bottom-[1%] -right-[0.5%] block bg-white border border-[#F0E4D2]"></span>
      </div>
    </section>
  );
};

export default PrivacyPolicyPage;
