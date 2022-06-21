
app.auth().onAuthStateChanged((user) => {
    if (user) {
        document.getElementById('menu-navegacion').innerHTML = `
            <a href="/students">Alumnos</a>
            <a href="/assign">Asignar Habitos</a>
            <a href="/validation">Validar Evidencia</a>
            <a href="/progress">Consultar progreso</a>
            <a onclick="logout()">Cerrar sesión</a>  
        `;    
    } 
});