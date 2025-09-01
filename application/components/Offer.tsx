import { Cog } from "lucide-react";

const CardHeader = ({
  features,
  // price,
  // discount,
}: {
  title: string;
  features: string;
  price: string;
  discount: string;
}) => {
  return (
    <div className="p-5 divide-y divide-[#F0E4D2]">
      <div className="space-y-6 pb-5">
        <div className="space-y-3">
          {features.split(",").map((feature) => (
            <div key={feature} className="flex items-center gap-3 text-2xl">
              <Cog className="w-5 h-5 text-[#09cd9f]" />
              <span>{feature.trim()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardHeader;
