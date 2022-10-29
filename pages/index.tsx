import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Message from "../components/Message";
import Spinner from "../components/Spinner";
import { auth, db } from "../utils/firebase";
import { IPropsPost } from "./stories/edit";
import { EmojiClickData } from "emoji-picker-react/dist/types/exposedTypes";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import EmojiButtonWithOpenModal from "../components/EmojiButtonWithOpenModal";
import EmojiButton from "../components/EmojiButton";

export default function Home() {
  const route = useRouter();
  const [allPosts, setAllPosts] = useState<IPropsPost[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getPosts = useCallback(() => {
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, orderBy("timestamp", 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const onSubmitEmoji = useCallback(
    async (postId: string, emojiDataUnified: string) => {
      if (!auth.currentUser) return route.push("/auth/login");
      if (!emojiDataUnified) {
        toast.error("Dont't leave an empty message", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1500,
        });
        return;
      }

      const hasSelectedEmoji = allPosts
        ?.find((post) => post.id === postId)
        ?.emoji?.[emojiDataUnified]?.includes(auth.currentUser.uid);

      const docRef = doc(db, "posts", postId);

      await updateDoc(docRef, {
        [`emoji.${emojiDataUnified}`]: hasSelectedEmoji
          ? arrayRemove(auth.currentUser.uid)
          : arrayUnion(auth.currentUser.uid),
      });
    },
    [allPosts, route]
  );

  const onUpdateExistEmoji = useCallback(
    (postId: string, emojiName: string) => {
      onSubmitEmoji(postId, emojiName);
    },
    [onSubmitEmoji]
  );

  const onSelectEmoji = useCallback(
    (postId: string, emojiData: EmojiClickData, event?: MouseEvent) => {
      onSubmitEmoji(postId, emojiData.unified);
    },
    [onSubmitEmoji]
  );

  useEffect(() => {
    getPosts();
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Story - Home</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="my-12 text-lg">
          <h2 className="text-2xl">See what other people are writing</h2>
          <div className="space-y-4">
            {allPosts.map((post) => {
              const _postId = post?.id;
              return (
                <Message key={_postId} {...post}>
                  <div className="flex gap-2">
                    {post?.emoji &&
                      Object?.keys(post?.emoji)?.map((emojiName) => {
                        const emojiCount = post?.emoji?.[emojiName]?.length;
                        if (!emojiCount) return null;
                        return (
                          <EmojiButton
                            key={emojiName}
                            onClick={() =>
                              onUpdateExistEmoji(_postId, emojiName)
                            }
                            emojiName={emojiName}
                            emojiCount={emojiCount}
                          />
                        );
                      })}
                    <EmojiButtonWithOpenModal
                      onSelectEmoji={onSelectEmoji}
                      postId={post?.id}
                    />
                    <Link href={{ pathname: `/stories/${_postId}` }}>
                      <button className="px-4 py-2 text-sm rounded-md hover:bg-slate-200 bg-slate-50">
                        comments ({post?.comments?.length ?? 0})
                      </button>
                    </Link>
                  </div>
                </Message>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
