"use client";
import { Github, Linkedin } from "lucide-react";
import Link from "next/link";
import Card from "@/components/Card";
import EmailForm from "@/components/EmailForm";
import MMLogo from "@/components/Logo";
import CardHeader from "@/components/Offer";

const LinkedinLink =
  process.env.NEXT_PUBLIC_LINKEDIN || "https://www.linkedin.com/";
const GithubLink = process.env.NEXT_PUBLIC_GITHUB || "https://www.github.com/";

export default function Home() {
  // Data from env
  const features =
    process.env.NEXT_PUBLIC_FEATURES ||
    "Sectoral templates, Sectoral templates, Sectoral templates";
  const date = process.env.NEXT_PUBLIC_LAUNCH_DATE || "2026-01-01";
  const title =
    process.env.NEXT_PUBLIC_TITLE ||
    "Join the waitlist for the MVP of MuseBoard";
  const description = process.env.NEXT_PUBLIC_OFFER_TITLE || "";

  return (
    <div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <div className="w-1/4 h-25 mx-auto object-contain mb-11 text-[#09cd9f]">
        <MMLogo />
      </div>
      <Card>
        <div className="grid md:grid-cols-2">
          <div className="md:order-1 order-2 content-center">
            <CardHeader title={description} features={features} />
          </div>
          <div className="md:order-2 order-1">
            <EmailForm date={date} title={title} />
          </div>
        </div>
        {/* <CardFooter /> */}
        {/* element */}
        <span className="w-2 h-2 absolute z-10 -top-[1%] -left-[0.5%]"></span>
        <span className="w-2 h-2 absolute z-10 -bottom-[1%] -left-[0.5%]"></span>
        <span className="w-2 h-2 absolute z-10 -top-[1%] -right-[0.5%]"></span>
        <span className="w-2 h-2 absolute z-10 -bottom-[1%] -right-[0.5%]"></span>
      </Card>
      <div className="pt-4 space-y-2">
        <div className="w-1/4 h-25 mx-auto object-contain">
          <div className="flex gap-2 justify-center">
            <Link
              href={LinkedinLink}
              target="_blank"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-600 shadow transition duration-200 ease-linear hover:bg-gray-100 hover:text-gray-500 hover:shadow-none"
            >
              <Linkedin size={22} />
            </Link>
            <Link
              href={GithubLink}
              target="_blank"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-600 shadow transition duration-200 ease-linear hover:bg-gray-100 hover:text-gray-500 hover:shadow-none"
            >
              <Github size={22} />
            </Link>
          </div>
        </div>
        <div className=" flex gap-2 text-[#B1ACA4] text-[12px] w-1/4 h-25 mx-auto object-contain justify-center">
          {" "}
          <Link
            href="https://musemachine.ai/en/legal-disclosure"
            target="_blank"
            className="underline transition-all duration-200 hover:text-white/90"
          >
            legal disclosure
          </Link>{" "}
          <Link
            href="https://musemachine.ai/en/privacy-policy"
            target="_blank"
            className="underline transition-all duration-200 hover:text-white/90"
          >
            privacy policy
          </Link>
        </div>
      </div>
    </div>
  );
}
