const btn_signin = document.getElementById('btn-signin');


btn_signin.onclick = function() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    //console.log(email+" "+password);
    app.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        var user = userCredential.user;
        location.href = '../view/index.html';
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        window.alert(errorMessage);
    });
}

app.auth().onAuthStateChanged((user) => {
    if (user) {
        location.href = './index.html';
    } 
});