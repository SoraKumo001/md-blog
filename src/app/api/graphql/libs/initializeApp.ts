import admin from 'firebase-admin';

export const initializeApp = async () => {
  !admin.apps.length &&
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.GOOGLE_PROJECT_ID,
        clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
        privateKey: process.env.GOOGLE_PRIVATE_KEY,
      }),
      storageBucket: `${process.env.GOOGLE_PROJECT_ID}.appspot.com`,
    });
};
