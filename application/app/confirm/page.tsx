import { Suspense } from "react";
import Link from "next/link";
import { Github, Linkedin } from "lucide-react";
import MMLogo from "@/components/Logo";
import ConfirmationUI from "@/components/Confirmation";

const LinkedinLink =
  process.env.NEXT_PUBLIC_LINKEDIN || "https://www.linkedin.com/";
const GithubLink = process.env.NEXT_PUBLIC_GITHUB || "https://www.github.com/";

export default function ConfirmPage() {
  return (
    <div>
      <div className="mx-auto object-contain mb-11 text-[#09cd9f]">
        <MMLogo />
      </div>
      <div className="grid md:grid-cols-2">
        <div className="md:col-span-2 flex justify-center items-center">
          <h1 className="font-bold">Subscription Confirmation</h1>
        </div>
        <div className="md:col-span-2 flex justify-center items-center">
          <Suspense fallback={<p>Confirming your subscription...</p>}>
            <ConfirmationUI />
          </Suspense>
        </div>
      </div>
      <div className="pt-10 space-y-2 content-end">
        <div className="mx-auto object-contain">
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
        <footer>
          <div className=" flex gap-2 text-[#B1ACA4] text-[12px] mx-auto object-contain justify-center">
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
        </footer>
      </div>
    </div>
  );
}
