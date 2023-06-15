import admin from 'firebase-admin';
import { isolatedFiles } from '@/libs/uploadFile';
import { restorationFiles } from './restorationFiles';

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.GOOGLE_PROJECT_ID,
    clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
    privateKey: process.env.GOOGLE_PRIVATE_KEY,
  }),
  storageBucket: `${process.env.GOOGLE_PROJECT_ID}.appspot.com`,
});

restorationFiles();
isolatedFiles();
