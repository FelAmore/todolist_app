import { auth } from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const doCreateUserWithEmailAndPassword = async (email, password) => {
    try {
        console.log('Creating user...');
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('User created:', user.uid);

        // Create a reference to the user document
        const userDocRef = doc(db, 'users', user.uid);

        // Create the user document
        await setDoc(userDocRef, { uid: user.uid });

        // Create a "todos" collection within the user document
        const todosCollectionRef = collection(userDocRef, 'todos');
        console.log('Todos collection created for user:', user.uid);

        return user;
    } catch (error) {
        console.error('User creation error:', error);
        throw error;
    }
};



export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if the user already exists in Firestore
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    // If the user doesn't exist in Firestore, add them
    if (!userDoc.exists()) {
      await setDoc(userRef, { uid: user.uid });
    }

    return user;
  } catch (error) {
    // Handle error here, such as displaying a message to the user
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const doSignOut = () => {
  return auth.signOut();
};

export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (password) => {
  return updatePassword(auth.currentUser, password);
};

export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/home`,
  });
};

export const useAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Redirect signed-in user to their homepage
        navigate(`/home/${user.uid}`);
      } else {
        // Redirect to login page if user signs out
        navigate("/login");
      }
    });

    return unsubscribe;
  }, [navigate]);
};
