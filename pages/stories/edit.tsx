import { auth, db } from "../../utils/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";

import { useCallback, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import Spinner from "../../components/Spinner";
import Head from "next/head";
import { IPropsComment } from "../../components/CommentCard";

export interface IPropsPost {
  id?: string;
  description?: string;
  timestamp?: any;
  user?: string;
  avatar?: string;
  username?: string;
  comments?: IPropsComment[];
  emoji?: { Sting: { userId: string; username: string }[] };
}

const EditPost = () => {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [post, setPost] = useState<IPropsPost>({ description: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const routerQuery = route.query;

  const onSubmitPost = useCallback(
    async (e) => {
      e.preventDefault();

      if (!post.description) {
        toast.error("Description Field empty", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1500,
        });
        return;
      }

      if (post.description.length > 400) {
        toast.error("Description too long", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1500,
        });
        return;
      }

      setIsLoading(true);
      if (post?.hasOwnProperty("id")) {
        const docRef = doc(db, "posts", post.id);
        const updatePost = { ...post, timestamp: serverTimestamp() };
        await updateDoc(docRef, updatePost);
        toast.success("Post was updated", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1500,
        });
        setIsLoading(false);
        return route.push("/dashboard");
      } else {
        const collectionRef = collection(db, "posts");
        await addDoc(collectionRef, {
          ...post,
          timestamp: serverTimestamp(),
          user: user?.uid,
          avatar: user?.photoURL,
          username: user?.displayName,
        });
        setPost({ description: "" });
        toast.success("Post has been made", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1500,
        });
        setIsLoading(false);
        return route.push("/");
      }
    },
    [post, route, user?.displayName, user?.photoURL, user?.uid]
  );

  const checkUser = useCallback(() => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-[80vh]">
          <Spinner />
        </div>
      );
    }
    if (!user) route.push("/auth/login");
    if (routerQuery?.id) {
      setPost({
        description: routerQuery?.description as string,
        id: routerQuery?.id as string,
      });
    }
  }, [loading, route, routerQuery?.description, routerQuery?.id, user]);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  return (
    <>
      <Head>
        <title>Story - Draft</title>
        <meta name="description" content="Create/Edit the story" />
      </Head>

      <main>
        <div className="p-12 my-20 rounded-lg shadow-lg">
          <form onSubmit={onSubmitPost}>
            <h1 className="text-2xl font-bold">
              {post?.hasOwnProperty("id")
                ? "Edit your story"
                : "Writing your story"}
            </h1>
            <div className="py-2">
              {/* <h3 className="py-2 text-lg font-medium">Tell your story...</h3> */}
              <textarea
                placeholder="your story..."
                value={post.description}
                onChange={(e) =>
                  setPost({ ...post, description: e.target.value })
                }
                className="w-full h-48 p-2 my-2 text-sm font-medium text-white bg-gray-800 rounded-lg"
              ></textarea>
              <p
                className={`text-cyan-600 font-medium text-sm ${
                  post.description.length > 300 ? "text-red-600" : ""
                }`}
              >{`${post.description.length || 0}/300`}</p>
            </div>
            <button
              //   onClick={onSubmitPost}
              type="submit"
              className="w-full px-4 py-2 font-medium text-center text-white rounded-lg bg-cyan-500"
            >
              {isLoading ? "loading..." : "Submit"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default EditPost;
