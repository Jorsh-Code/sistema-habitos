const btn_signin = document.getElementById('btn-signin');

btn_signin.onclick = function() { 
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    db.collection("profesores").where("email", "==", email)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            document.cookie = "id_user=" + doc.data().employee_number;
        });
        app.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            var user = userCredential.user;
            location.href = '/';
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            window.alert(errorMessage);
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    }); 
    
}

app.auth().onAuthStateChanged((user) => {
    if (user) {
        location.href = '/';
    } 
});