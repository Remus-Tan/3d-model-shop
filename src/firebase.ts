import { getApp, getApps, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3VyrCAv5Z9ZrgTnLru0yjchZ2iY6IgEc",
  authDomain: "d-shop-2a072.firebaseapp.com",
  projectId: "d-shop-2a072",
  storageBucket: "d-shop-2a072.appspot.com",
  messagingSenderId: "733941991425",
  appId: "1:733941991425:web:9be367f1d38eabdeb6d800"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };