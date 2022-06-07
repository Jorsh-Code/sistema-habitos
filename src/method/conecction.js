let id_user="";
if(document.cookie) id_user =  document.cookie.slice(8,document.cookie.length);

const firebaseConfig = {
  apiKey: "AIzaSyCmM5WMFobnt_E1EB2TTM6EkT_CJxM4Yfo",
  authDomain: "proyecto-joven-uwu.firebaseapp.com",
  projectId: "proyecto-joven-uwu",
  storageBucket: "proyecto-joven-uwu.appspot.com",
  messagingSenderId: "1001076045080",
  appId: "1:1001076045080:web:86bf6c6609a8fb23839a6d"
};
 
const app = firebase.initializeApp(firebaseConfig);
const db  = firebase.firestore();

/*const firebaseConfig = {
   apiKey: "AIzaSyCmM5WMFobnt_E1EB2TTM6EkT_CJxM4Yfo",
   authDomain: "proyecto-joven-uwu.firebaseapp.com",
   projectId: "proyecto-joven-uwu",
   storageBucket: "proyecto-joven-uwu.appspot.com",
   messagingSenderId: "1001076045080",
   appId: "1:1001076045080:web:86bf6c6609a8fb23839a6d"
 };

const app = firebase.initializeApp(firebaseConfig);*/

 