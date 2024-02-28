import firebase from "firebase/compat/app";
import "firebase/firestore";
import "firebase/compat/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: "pokemon-go-gym.firebaseapp.com",
    projectId: "pokemon-go-gym",
    storageBucket: "pokemon-go-gym.appspot.com",
    messagingSenderId: "48932195856",
    appId: "1:48932195856:web:93f21318228a7976e34495",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export default firebase;
