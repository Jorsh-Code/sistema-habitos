const btn_signup = document.getElementById('btn-signup');
let pass = 0;

btn_signup.onclick = function(){
    const email           = document.getElementById('email').value;
    const password        = document.getElementById('password').value;
    const employee_number = document.getElementById('employee-number').value;
    const name            = document.getElementById('name').value;
    const last_name       = document.getElementById('last-name').value;
    const full_name       = name + ' ' + last_name;
    pass = 1;
    app.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
        db.collection("profesores").doc(employee_number).set({
            employee_number,
            name: full_name,
            email
        })
        .then(() => {
            document.cookie = "id_user=" + employee_number;
            pass = 0;
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });

        var user = userCredential.user;
        location.href = '../view/index.html';
        //console.log("user");
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        window.alert(errorMessage);
    });
}

app.auth().onAuthStateChanged((user) => {
    if (user && pass===0) {
        location.href = './index.html';
    } 
});