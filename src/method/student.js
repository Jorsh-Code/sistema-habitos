
app.auth().onAuthStateChanged((user) => {
    if (user) {
        getGrupos();
    }else{
        location.href = './index.html';
    }
});


function getGrupos(){
    db.collection("Grupos").where("estatus", "==", "Habilitado").where('id_profesor','==',id_user)
        .get()
        .then((querySnapshot) => {
            let txt = `           
            <tr style="text-align: center;">
                <th>Fecha de registro</th>
                <th>Fecha de registro</th>
                <th></th>
            </tr>
            `;
            querySnapshot.forEach((doc) => {
                txt += `
                <tr style="text-align: center;" id="${doc.id}">
                <td>${doc.data().fecha_registro}</td>
                <td>${doc.data().grupo}</td>
                <td><button onclick="verAlumnos('${doc.id}')">Ver Alumnos</button><br>
                <button onclick="desGrupo('${doc.id}')">Deshabilitar</button></td>
                </tr>
                `;
                
                //console.log(doc.id, " => ", doc.data());
            });
            document.getElementById('tabla-grupos').innerHTML =  txt;
            document.getElementById('tabla-grupos').style.display = 'block';
            
        })
    .catch((error) => {
            console.log("Error getting documents: ", error);
    });  
}


function crearGrupo(){
    const grupo  = document.getElementById('nombre-grupo').value;
    const fecha_registro =  document.getElementById('fecha-registro').value;
    const id_profesor = id_user;
    const estatus = 'Habilitado';
    const id = grupo+fecha_registro.slice(0,4)+fecha_registro.slice(5,7)+id_profesor ; 
    //console.log(id);
    if(grupo == '' || fecha_registro == ''){
        alert('Ingrese nombre del grupo y fecha de registro');
    }else{
        db.collection("Grupos").doc(id).set({
            grupo,
            fecha_registro,
            id_profesor,
            estatus,
            id
        })
        .then(() => {
            document.getElementById('nombre-grupo').value = '';
            document.getElementById('fecha-registro').value = '';
            getGrupos();
            alert('Grupo '+grupo+' creado con exito');
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    }

}


function verAlumnos(id_grupo){
    document.getElementById('tabla-grupos').style.display = 'none';
    document.getElementById('seleccion').style.display = 'none';
    document.getElementById('regresar').style.display = 'block';
    db.collection("Estudiantes").where("id_grupo", "==", id_grupo).where('Profesor','==',id_user)
    .get()
    .then((querySnapshot) => {
        let txt = `           
            <tr style="text-align: center;">
                <th>Boleta</th>
                <th>Grupo</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th></th>
            </tr>
            `;
        querySnapshot.forEach((doc) => {
            if(doc.data().Estatus == 'Verificado'){
                txt += `
                <tr style="text-align: center;" id="${doc.id}">
                <td>${doc.data().Boleta}</td>
                <td>${doc.data().Grupo}</td>
                <td>${doc.data().Nombre}</td>
                <td>${doc.id}</td>
                <td><button onclick="eliminarAlumno('${doc.id+'-'+doc.data().id_grupo}')">Eliminar</button><br>
                </tr>
                `;
            }else{
                txt += `
                <tr style="text-align: center;" id="${doc.id}">
                <td>${doc.data().Boleta}</td>
                <td>${doc.data().Grupo}</td>
                <td>${doc.data().Nombre}</td>
                <td>${doc.id}</td>
                <td><button onclick="verificarAlumno('${doc.id+'-'+doc.data().id_grupo}')">Verificar</button><br>
                </tr>
                `;
            } 
           
            //console.log(doc.id, " => ", doc.data());
        });
            document.getElementById('tabla-alumnos').innerHTML =  txt;
            document.getElementById('tabla-alumnos').style.display = 'block';
    })
    .catch((error) => {
        console.log("Error getting documents:", error);
    });
}

function desGrupo(id_grupo){
    db.collection("Grupos").doc(id_grupo).update({
        estatus: 'Deshabilitado'
    })
    .then(() => {
        getGrupos();
        alert('Grupo '+id_grupo.slice(0,4)+' deshabilitado con exito');
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
}


function getAllGrupos(){
    const check = document.getElementById('ver-todos');
    if(check.checked){
        db.collection("Grupos").where('id_profesor','==',id_user)
        .get()
        .then((querySnapshot) => {
            let txt = `           
            <tr style="text-align: center;">
                <th>Fecha de registro</th>
                <th>Fecha de registro</th>
                <th></th>
            </tr>
            `;
            querySnapshot.forEach((doc) => {
                txt += `
                <tr style="text-align: center;" id="${doc.id}">
                <td>${doc.data().fecha_registro}</td>
                <td>${doc.data().grupo}</td>
                <td><button onclick="verAlumnos('${doc.id}')">Ver Alumnos</button><br>
                </tr>
                `;
                
                //console.log(doc.id, " => ", doc.data());
            });
            document.getElementById('tabla-grupos').innerHTML =  txt;
            
        })
        .catch((error) => {
                console.log("Error getting documents: ", error);
        });  
    }else{
        getGrupos();
    }
}

function regresar(){
    document.getElementById('seleccion').style.display = 'block';
    document.getElementById('tabla-grupos').style.display = 'block';
    document.getElementById('tabla-alumnos').style.display = 'none';
    document.getElementById('regresar').style.display = 'none';
}

function verificarAlumno(id){
    db.collection("Estudiantes").doc(id.split('-')[0]).update({
        Estatus: 'Verificado'
    })
    .then(() => {
        alert('Verificado');
        verAlumnos(id.split('-')[1]);

    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
}

function eliminarAlumno(id){
    db.collection("Estudiantes").doc(id.split('-')[0]).delete().then(() => {
        alert('Alumno Eliminado');
        verAlumnos(id.split('-')[1]);
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}