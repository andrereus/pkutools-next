import type { NextPage } from "next";
import firebaseClient from "../firebase/client";
import { getAuth, signOut } from "firebase/auth";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";

const auth = getAuth(firebaseClient);

const Home: NextPage = () => {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  const router = useRouter();

  const logout = () => {
    signOut(auth);
    router.reload();
  };

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }
  if (loading) {
    return (
      <div>
        <p>Loading ...</p>
      </div>
    );
  }
  if (user) {
    return (
      <div>
        <p>Hello {user.user.displayName}</p>
        <button onClick={() => logout()}>Sign Out</button>
      </div>
    );
  }
  return (
    <div>
      <button onClick={() => signInWithGoogle()}>Sign In</button>
    </div>
  );
};

export default Home;
