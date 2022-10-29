import React from "react";
import Image from "next/image";

export interface IPropsComment {
  message?: string;
  avatar?: string;
  username?: string;
  timestamp?: { seconds: number; nanoseconds: number };
  children?: React.ReactNode;
}

const CommentCard = ({
  children,
  avatar,
  message,
  timestamp,
  username,
}: IPropsComment) => {
  return (
    <div className="p-4 rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
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
        <h3 className="text-xs">
          {String(new Date(timestamp?.seconds * 1000).toLocaleString())}
        </h3>
      </div>
      <div className="py-4">
        <p>{message}</p>
      </div>
      {children}
    </div>
  );
};

export default CommentCard;
