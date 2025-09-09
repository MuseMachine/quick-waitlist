import { Suspense } from "react";
import Link from "next/link";
import { Github, Linkedin } from "lucide-react";
import MMLogo from "@/components/Logo";
import UnsubscribeUI from "@/components/Unsubscribe";

export default function UnsubscribePage() {
  return (
    <div>
      <div className="mx-auto object-contain mb-11 text-[#09cd9f]">
        <MMLogo />
      </div>
      <div className="grid md:grid-cols-2">
        <div className="md:col-span-2 flex justify-center items-center">
          <h1 className="font-bold">Unsubscribe</h1>
        </div>
        <div className="md:col-span-2 flex justify-center items-center">
          <Suspense fallback={<p>Removing your subscription...</p>}>
            <UnsubscribeUI />
          </Suspense>
        </div>
      </div>
      <div className="pt-10 space-y-2 content-end">
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
