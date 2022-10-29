import React from "react";
import Image from "next/image";
import { IPropsPost } from "../pages/stories/edit";

export interface IPropsComment {
  message?: string;
  avatar?: string;
  userName?: string;
  timestamp?: string;

  children?: React.ReactNode;
}

const CommentCard = ({
  children,
  avatar,
  message,
  timestamp,
  userName,
}: IPropsComment) => {
  return (
    <div className="p-4 rounded-lg shadow-lg">
      <div className="flex items-center gap-2">
        <Image
          alt="profile picture"
          src={avatar}
          className="w-10 rounded-full cursor-pointer"
          width={50}
          height={50}
        />
        <h2>{userName}</h2>
      </div>
      <div className="py-4">
        <p>{message}</p>
      </div>
      {children}
    </div>
  );
};

export default CommentCard;
