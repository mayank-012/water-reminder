import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc,deleteDoc,addDoc,collection, query, where , getDocs} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCoYjlusuguVBe9cR3WIWOgcscyn3KB-kA",
  authDomain: "temp-c9255.firebaseapp.com",
  projectId: "temp-c9255",
  storageBucket: "temp-c9255.appspot.com",
  messagingSenderId: "339522748290",
  appId: "1:339522748290:web:5f54dfbe1e0a83019f199b",
  measurementId: "G-2KZ7CVZWTV"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, doc, setDoc, getDoc,deleteDoc,addDoc,collection, query, where, getDocs};
