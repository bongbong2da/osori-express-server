import { cert, getApp, initializeApp } from 'firebase-admin/app';

const firebaseAccount = require('./osori-e3c48-firebase-adminsdk-2yumf-6e3953a34e.json');

const FirebaseApp = () => {
  try {
    return getApp();
  } catch (e) {
    return initializeApp({ credential: cert(firebaseAccount) });
  }
};

export default FirebaseApp;
