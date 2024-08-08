import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyD9Wm-l8-EirURTCF5eyDv_vvVikitzf7U",
    authDomain: "medi-help-app-c7a08.firebaseapp.com",
    projectId: "medi-help-app-c7a08",
    storageBucket: "medi-help-app-c7a08.appspot.com",
    messagingSenderId: "589690549554",
    appId: "1:589690549554:web:dddfd4b138cc7083cb132b",
    measurementId: "G-8TGFWHY6JP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, db, storage, auth };