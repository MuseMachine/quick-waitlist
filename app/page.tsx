import Card from "@/components/Card";
import CardHeader from "@/components/Offer";
import EmailForm from "@/components/EmailForm";
import MMLogo from "@/components/Logo";

export default function Home() {
  // Data from env
  const features =
    process.env.NEXT_PUBLIC_FEATURES ||
    "Sectoral templates, Sectoral templates, Sectoral templates";
  const price = process.env.NEXT_PUBLIC_CURRENT_PRICE || "";
  const discountPrice = process.env.NEXT_PUBLIC_DISCOUNT_PRICE || "";
  const date = process.env.NEXT_PUBLIC_LAUNCH_DATE || "2026-01-01";
  const title =
    process.env.NEXT_PUBLIC_TITLE ||
    "Join the waitlist for the MVP of MuseBoard";
  const description = process.env.NEXT_PUBLIC_OFFER_TITLE || "";

  console.log(price);
  return (
    <div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <div className="w-1/4 h-25 mx-auto object-contain mb-5 text-[#09cd9f]">
        <MMLogo />
      </div>
      <Card>
        <div className="grid md:grid-cols-2 md:divide-x divide-[#F0E4D2]">
          <div className="md:order-1 order-2">
            <CardHeader
              title={description}
              features={features}
              price={price}
              discount={discountPrice}
            />
          </div>
          <div className="md:order-2 order-1">
            <EmailForm date={date} title={title} />
          </div>
        </div>

        {/* <CardFooter /> */}

        {/* element */}
        <span className="w-2 h-2 absolute z-10 -top-[1%] -left-[0.5%] block bg-white border border-[#F0E4D2]"></span>
        <span className="w-2 h-2 absolute z-10 -bottom-[1%] -left-[0.5%] block bg-white border border-[#F0E4D2]"></span>
        <span className="w-2 h-2 absolute z-10 -top-[1%] -right-[0.5%] block bg-white border border-[#F0E4D2]"></span>
        <span className="w-2 h-2 absolute z-10 -bottom-[1%] -right-[0.5%] block bg-white border border-[#F0E4D2]"></span>
      </Card>
    </div>
  );
}
