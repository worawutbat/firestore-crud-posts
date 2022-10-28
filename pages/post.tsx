import { auth, db } from "../utils/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCallback, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import Spinner from "../components/Spinner";

const Post = () => {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [post, setPost] = useState({ description: "" });

  const onSubmitPost = useCallback(
    async (e) => {
      e.preventDefault();
      const collectionRef = collection(db, "posts");
      await addDoc(collectionRef, {
        ...post,
        timestamp: serverTimestamp(),
        user: user?.uid,
        avatar: user?.photoURL,
        username: user?.displayName,
      });
      setPost({ description: "" });
      return route.push("/");
    },
    [post, route, user?.displayName, user?.photoURL, user?.uid]
  );

  if (loading) {
    <div className="flex items-center justify-center h-[80vh]">
      <Spinner />
    </div>;
  }

  return (
    <div className="p-12 my-20 rounded-lg shadow-lg">
      <form onSubmit={onSubmitPost}>
        <h1 className="text-2xl font-bold">Create a new post</h1>
        <div className="py-2">
          <h3 className="py-2 text-lg font-medium">Description</h3>
          <textarea
            value={post.description}
            onChange={(e) => setPost({ ...post, description: e.target.value })}
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
          Submit
        </button>
      </form>
    </div>
  );
};

export default Post;
