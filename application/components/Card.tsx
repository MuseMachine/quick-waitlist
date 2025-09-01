import React from "react";

const Card = ({
  children,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className="max-w-screen-lg w-full mx-auto relative">{children}</div>
  );
};

export default Card;
