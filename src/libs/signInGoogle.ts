import { initializeApp } from '@firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from '@firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_apiKey,
  projectId: process.env.NEXT_PUBLIC_projectId,
  authDomain: `${process.env.NEXT_PUBLIC_projectId}.firebaseapp.com`,
};
const provider = new GoogleAuthProvider();

const auth = getAuth(initializeApp(firebaseConfig));

export const signInGoogle = () => {
  return signInWithPopup(auth, provider).then((v) => v.user.getIdToken());
};
