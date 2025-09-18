import Link from "next/link";

const CardFooter = () => {
  return (
    <div className="mt-4 pt-4 space-y-2">
      <div className="text-[#B1ACA4] text-[12px]">
        {" "}
        <Link
          href="https://musemachine.ai/en/legal-disclosure"
          target="_blank"
          className="underline transition-all duration-200 hover:text-black/70"
        >
          Legal Disclosure
        </Link>
      </div>
      <div className="text-[#B1ACA4] text-[12px]">
        {" "}
        <Link
          href="https://musemachine.ai/en/privacy-policy"
          target="_blank"
          className="underline transition-all duration-200 hover:text-black/70"
        >
          privacy policy
        </Link>
      </div>
    </div>
  );
};

export default CardFooter;
