
app.auth().onAuthStateChanged((user) => {
    if (user) {
        document.getElementById('menu-navegacion').innerHTML = `
            <a href="./students.html">Alumnos</a>
            <a href="./assign.html">Asignar Habitos</a>
            <a href="./validation.html">Validar Evidencia</a>
            <a href="./signup.html">Consultar progreso</a>
            <a onclick="logout()">Cerrar sesión</a>  
        `;    
    } 
});