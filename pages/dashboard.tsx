import { auth } from "../utils/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCallback, useEffect } from "react";

const Dashboard = () => {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);

  const onLogout = useCallback(() => auth.signOut(), []);

  const getUser = useCallback(async () => {
    if (loading) return;
    if (!user) return await route.push("/auth/login");
  }, [loading, route, user]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <div>
      <h1>Your posts</h1>
      <div>posts</div>
      <button onClick={onLogout}>Sign out</button>
    </div>
  );
};

export default Dashboard;
