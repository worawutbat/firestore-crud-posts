import Link from "next/link";
import React from "react";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Image from "next/image";

const LOGO_PATHNAME = "/static/images/batman-logo.png";

const Nav = () => {
  const [user, loading] = useAuthState(auth);

  return (
    <nav className="flex items-center justify-between py-4">
      <Link href="/">
        <button className="flex items-center gap-2 text-lg font-medium">
          <Image
            alt="logo"
            src={LOGO_PATHNAME}
            className="w-10 rounded-full cursor-pointer"
            width={50}
            height={50}
          />
          Story
        </button>
      </Link>
      <ul className="flex items-center gap-10">
        {!user && (
          <Link href="/auth/login">
            <div className="px-4 py-2 text-sm text-white rounded-lg bg-cyan-500">
              Join Now
            </div>
          </Link>
        )}
        {user && (
          <div className="flex items-center gap-6">
            <Link href="/stories/edit">
              <button className="px-4 py-2 text-sm font-medium text-white rounded-md bg-cyan-500">
                Write
              </button>
            </Link>
            <Link href="/dashboard">
              <Image
                alt="profile picture"
                src={user.photoURL}
                className="w-10 rounded-full cursor-pointer"
                width={50}
                height={50}
              />
            </Link>
          </div>
        )}
      </ul>
    </nav>
  );
};

export default Nav;
