import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCallback, useEffect } from "react";
import Spinner from "../../components/Spinner";

const Login = () => {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);

  const onLoginWithGoogle = useCallback(async () => {
    const googleProvider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      route.push("/");
    } catch (err) {
      console.error(err);
    }
  }, [route]);

  useEffect(() => {
    if (user) {
      route.push("/");
    } else {
      console.log("login");
    }
  }, [route, user]);

  if (loading) {
    <div className="flex items-center justify-center h-[80vh]">
      <Spinner />
    </div>;
  }
  
  return (
    <div className="p-10 mt-32 text-gray-700 rounded-lg shadow-xl">
      <h2 className="text-2xl font-medium">Join Today</h2>
      <div className="py-4">
        <h3 className="py-4">Sign in with one of ther providers</h3>
        <button
          className="flex w-full p-4 font-medium text-white align-middle bg-gray-700 rounded-lg"
          onClick={onLoginWithGoogle}
        >
          <FcGoogle className="text-2xl" />
          Sign In with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
