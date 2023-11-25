import { FirebaseOptions, initializeApp } from '@firebase/app';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_apiKey,
  projectId: process.env.NEXT_PUBLIC_projectId,
  authDomain: `${process.env.NEXT_PUBLIC_projectId}.firebaseapp.com`,
  storageBucket: `${process.env.NEXT_PUBLIC_projectId}.appspot.com`,
};

export const firebaseApp = initializeApp(firebaseConfig);
