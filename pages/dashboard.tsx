import { auth, db } from "../utils/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCallback, useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import Message from "../components/Message";

import { AiFillEdit, AiOutlineDelete } from "react-icons/ai";
import Link from "next/link";
import Head from "next/head";

const Dashboard = () => {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [ownerPosts, setOwnerPosts] = useState([]);

  const getUser = useCallback(async () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-[80vh]">
          <Spinner />
        </div>
      );
    }

    if (!user) return await route.push("/auth/login");

    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, where("user", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOwnerPosts(
        snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
    return unsubscribe;
  }, [loading, route, user]);

  const onDeletePost = useCallback(async (id: string) => {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
  }, []);

  const onLogout = useCallback(() => auth.signOut(), []);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <>
      <Head>
        <title>Story - DashBoard</title>
        <meta name="description" content="My DashBoard" />
      </Head>
      <div className="space-y-4">
        <h1 className="text-lg font-medium">Your story posts</h1>
        <div>
          {ownerPosts.map((post) => (
            <Message key={post.id} {...post}>
              <div className="flex gap-4">
                <button
                  className="flex items-center justify-center gap-2 py-2 text-sm text-pink-500"
                  onClick={() => onDeletePost(post.id)}
                >
                  <AiOutlineDelete className="text-xl" />
                  Delete
                </button>
                <Link href={{ pathname: "/stories/edit", query: post }}>
                  <button className="flex items-center justify-center gap-2 py-2 text-sm text-teal-500">
                    <AiFillEdit className="text-xl" />
                    Edit
                  </button>
                </Link>
              </div>
            </Message>
          ))}
        </div>
        <button
          className="px-4 py-2 font-medium text-white bg-gray-800 rounded-sm"
          onClick={onLogout}
        >
          Sign out
        </button>
      </div>
    </>
  );
};

export default Dashboard;
