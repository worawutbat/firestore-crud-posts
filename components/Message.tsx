import React from "react";
import Image from "next/image";
import { IPropsPost } from "../pages/stories/edit";

interface IPropsMessage extends IPropsPost {
  children?: React.ReactNode;
}

const Message = ({
  children,
  avatar,
  description,
  // id,
  // timestamp,
  // user,
  username,
}: IPropsMessage) => {
  return (
    <div className="p-4 divide-y rounded-lg shadow-lg ">
      <div>
        <div className="flex items-center gap-2">
          <Image
            alt="profile picture"
            src={avatar}
            className="w-10 rounded-full cursor-pointer"
            width={50}
            height={50}
          />
          <h2>{username}</h2>
        </div>
        <div className="px-2 py-4">
          <p>{description}</p>
        </div>
      </div>
      {children && <div className="pt-1">{children}</div>}
    </div>
  );
};

export default Message;
