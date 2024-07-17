import { useEffect, useState, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth,db } from "../server/firebaseConfig";
import { child, get, ref } from "firebase/database";

const useFirebaseAuth = () => {
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const dbRef = ref(db);

    const fetchUserData = useCallback(async (uid) => {
        try {
            const snapshot = await get(child(dbRef, `users/${uid}`));
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                console.log("No data available");
                return null;
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    }, [dbRef]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userData = await fetchUserData(user.uid);
                setCurrentUser({ ...user, ...userData });
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [fetchUserData]);

    return { loading, currentUser };
};
export default useFirebaseAuth;