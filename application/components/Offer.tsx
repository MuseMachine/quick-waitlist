import { Cog } from "lucide-react";

const CardHeader = ({ features }: { title: string; features: string }) => {
  return (
    <div className="max-sm:pt-0 pt-5">
      <div className="space-y-6 pb-5">
        <div className="mt-8">
          {features.split(",").map((feature) => (
            <div key={feature} className="flex items-center justify-center gap-3 text-2xl max-sm:text-lg mb-3">
              <Cog className="w-5 h-5 text-[#0FFEC5]" />
              <span>{feature.trim()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardHeader;
