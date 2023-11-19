// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDE3ZbA90p3yVdRCjiU_LgmUJOXXe_1dso",
  authDomain: "culinarycollab.firebaseapp.com",
  projectId: "culinarycollab",
  storageBucket: "culinarycollab.appspot.com",
  messagingSenderId: "908985843966",
  appId: "1:908985843966:web:fecba0089ca2c22bd4e5af",
  measurementId: "G-700XG3Z51G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { firestore, auth };
