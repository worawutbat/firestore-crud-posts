import {
  arrayUnion,
  doc,
  getDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Message from "../../../components/Message";
import Spinner from "../../../components/Spinner";
import { auth, db } from "../../../utils/firebase";
import { IPropsPost } from "../edit";
import pick from "lodash/pick";
import CommentCard from "../../../components/CommentCard";
import Head from "next/head";

const Post = () => {
  const route = useRouter();
  const routerQuery = route.query;
  const postId = routerQuery?.slug;

  const [post, setPost] = useState<IPropsPost | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  const [message, setMessage] = useState<string | undefined>();

  const getPostDetail = useCallback(async () => {
    // setIsLoading(true);

    const docRef = doc(db, "posts", postId as string);
    const docSnap = await getDoc(docRef);

    const post = pick(docSnap?.data(), [
      "id",
      "description",
      // "timestamp",
      "user",
      "avatar",
      "username",
      "comments",
    ]);

    if (!post) {
      // setIsLoading(false);
      setIsNotFound(true);
      return;
    }

    setIsLoading(false);
    setPost(post);
  }, [postId]);

  useEffect(() => {
    if (!route.isReady) return setIsLoading(true);
    if (!postId) return setIsNotFound(true);
    getPostDetail();
  }, [getPostDetail, postId, post, route.isReady]);

  const onSubmitPost = useCallback(async () => {
    if (!auth.currentUser) return route.push("/auth/login");
    if (!message) {
      toast.error("Dont't leace an empty message", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }

    const docRef = doc(db, "posts", postId as string);
    await updateDoc(docRef, {
      comments: arrayUnion({
        message,
        avatar: auth.currentUser.photoURL,
        username: auth.currentUser.displayName,
        timestamp: Timestamp.now(),
      }),
    });

    setMessage("");
  }, [message, postId, route]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Spinner />
      </div>
    );

  if (isNotFound)
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div>NotFound a Post</div>
      </div>
    );

  return (
    <>
      <Head>
        <title>Story- {post ? post.description : "Writing"}</title>
        <meta
          name="description"
          content={post ? post.description : "Post Detail"}
        />
        <link rel="canonical" href={`/stories/${postId}`} />
      </Head>

      <div className="my-4">
        {post && <Message {...post} />}
        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What do you think?"
            className="w-full p-2 text-sm text-white bg-gray-800"
          />
          <button
            className="px-4 py-2 text-sm text-white bg-cyan-500"
            onClick={onSubmitPost}
          >
            Submit
          </button>
        </div>

        <div>
          <h2 className="my-2 text-lg">Comments</h2>
          <div>
            {post &&
              post?.comments?.map((comment, _id) => (
                <CommentCard key={_id} {...comment} />
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
