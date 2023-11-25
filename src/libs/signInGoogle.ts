import { getAuth, GoogleAuthProvider, signInWithPopup } from '@firebase/auth';
import { firebaseApp } from './getFirebaseApp';

const provider = new GoogleAuthProvider();

const auth = getAuth(firebaseApp);

export const signInGoogle = () => {
  return signInWithPopup(auth, provider).then((v) => v.user.getIdToken());
};
