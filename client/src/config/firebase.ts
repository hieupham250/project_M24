import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.ViTE_KEY_FIREBASE,
  authDomain: "project-react-8dc1e.firebaseapp.com",
  projectId: "project-react-8dc1e",
  storageBucket: "project-react-8dc1e.appspot.com",
  messagingSenderId: "1043767533745",
  appId: "1:1043767533745:web:b6574914c0c0a7ecafc290",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
