import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBspDgCRa_mgUOqA5DyTjM6vW4MK4n7e5o",
  authDomain: "hungrybaaz-840c0.firebaseapp.com",
  projectId: "hungrybaaz-840c0",
  storageBucket: "hungrybaaz-840c0.appspot.com",
  messagingSenderId: "525941660823",
  appId: "1:525941660823:web:8083b91adad94d7b951dd2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)

export const provider = new GoogleAuthProvider()