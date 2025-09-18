import type React from "react";

const Card = ({
  children,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className="relative max-w-[500px] w-full mx-auto">{children}</div>
  );
};

export default Card;
