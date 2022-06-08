let id_user="";
if(document.cookie) { 
  const cookies = document.cookie.split(';');
  for(let i = 0; i < cookies.length; i++){
    if(cookies[i].indexOf('id_user') != -1){
      id_user =  cookies[i].slice(8,cookies[i].length);
      break;
    }
  }
  
}

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


function logout(){
  app.auth().signOut().
  then(() => {
    location.href = './index.html';
  }).catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    window.alert(errorMessage);
  });
}
/*const firebaseConfig = {
   apiKey: "AIzaSyCmM5WMFobnt_E1EB2TTM6EkT_CJxM4Yfo",
   authDomain: "proyecto-joven-uwu.firebaseapp.com",
   projectId: "proyecto-joven-uwu",
   storageBucket: "proyecto-joven-uwu.appspot.com",
   messagingSenderId: "1001076045080",
   appId: "1:1001076045080:web:86bf6c6609a8fb23839a6d"
 };

const app = firebase.initializeApp(firebaseConfig);*/

 