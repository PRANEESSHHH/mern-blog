// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyD0jtKghHa3nnGKPt7BMsIw_bWp5HaV_z8",
  authDomain: "mern-blog-d5f8e.firebaseapp.com",
  projectId: "mern-blog-d5f8e",
  storageBucket: "mern-blog-d5f8e.firebasestorage.app",
  messagingSenderId: "433713637475",
  appId: "1:433713637475:web:b29e1ae9ba965fed307056"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
