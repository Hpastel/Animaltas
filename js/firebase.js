const firebaseConfig = {
  apiKey: "AIzaSyDAPkvEqSLvN9NuvMrY0FnGdDevC607hQE",
  authDomain: "animaltas-d92f4.firebaseapp.com",
  databaseURL:
    "https://animaltas-d92f4-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "animaltas-d92f4",
  storageBucket: "animaltas-d92f4.appspot.com",
  messagingSenderId: "237326625854",
  appId: "1:237326625854:web:586f4d1b7451ed624cb56f",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    document.getElementById('perfil').style.display = 'block';
    document.getElementById('login').style.display = 'none'
    document.getElementById('register').style.display = 'none'
  } else {
    // User is signed out.
    document.getElementById('perfil').style.display = 'none';
    document.getElementById('login').style.display = 'block';
    document.getElementById('register').style.display = 'block';
  }
});

firebase.auth()