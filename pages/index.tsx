import type { NextPage } from "next";
import firebaseClient from "../firebase/client";
import { getAuth, signOut } from "firebase/auth";
import { ref, getDatabase } from "firebase/database";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { useList } from "react-firebase-hooks/database";
import { useRouter } from "next/router";

const auth = getAuth(firebaseClient);
const database = getDatabase(firebaseClient);

const Home: NextPage = () => {
  const [signInWithGoogle, user, authloading, autherror] =
    useSignInWithGoogle(auth);
  const [snapshots, dbloading, dberror] = useList(
    ref(database, user?.user.uid + "/ownFood")
  );
  const router = useRouter();

  const logout = () => {
    signOut(auth);
    router.reload();
  };

  if (autherror) {
    return (
      <div>
        <p>Error: {autherror.message}</p>
      </div>
    );
  }
  if (authloading) {
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
        <button onClick={() => logout()} className="btn">
          Sign Out
        </button>
        <p>
          {dberror && <strong>Error: {dberror.message}</strong>}
          {dbloading && <span>Loading ...</span>}

          {!dbloading && snapshots && (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Icon</th>
                    <th>Name</th>
                    <th>Phe</th>
                  </tr>
                </thead>
                <tbody>
                  {snapshots.map((data) => (
                    <tr key={data.key}>
                      <td>{data.val().icon}</td>
                      <td>{data.val().name}</td>
                      <td>{data.val().phe}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </p>
      </div>
    );
  }
  return (
    <div>
      <button onClick={() => signInWithGoogle()} className="btn">
        Sign In
      </button>
    </div>
  );
};

export default Home;
