import type React from "react";

const Card = ({
  children,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className="relative max-w-[500px] md:max-w-4xl w-full mx-auto">{children}</div>
  );
};

export default Card;
