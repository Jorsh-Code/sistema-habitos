app.auth().onAuthStateChanged((user) => {
    if (user) {
        db.collection("Grupos").where("estatus", "==", "Habilitado").where('id_profesor','==',id_user)
        .get()
        .then((querySnapshot) => {
            let txt = "";
            let init = 1;
            querySnapshot.forEach((doc) => {
                txt += `<option value=${doc.data().id} >${doc.data().grupo}</option>`;
                if(init===1){ getAlumnos(doc.data().id); init++; } 
                //console.log(doc.id, " => ", doc.data());
            });
            document.getElementById('select-grupo').innerHTML =  txt;
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });   
    }else{
        location.href = './index.html';
    }
});

function getAlumnos(...args){
    //console.log(grupo);
    let grupo;
    args[0] != undefined ? grupo = args[0] : grupo = document.getElementById('select-grupo').value;
    db.collection("Estudiantes").where("id_grupo", "==", grupo).where('Profesor','==',id_user)
    .get()
    .then((querySnapshot) => {
        let txt = "";
        querySnapshot.forEach((doc) => {
            txt += `<option id="${doc.id}" value="${doc.id}" >${doc.data().Nombre}</option>`;
            //console.log(doc.id, " => ", doc.data());
        });
            document.getElementById('select-alumno').innerHTML =  txt;
    })
    .catch((error) => {
        console.log("Error getting documents:", error);
    });    
}

function getEvidencias(...args){
    let correo;
    args[0] != undefined ? correo = args[0] : correo = document.getElementById('select-alumno').value;
    db.collection("Evidencias").where('Correo','==',correo)
    .get()
    .then((querySnapshot) => {
        //console.log(querySnapshot.data());
        let txt = `
        <tr>
            <th>Evidencia</th>
            <th>Habito</th>
            <th>Fecha de registro</th>
            <th>Comentarios</th>
            <th></th>
        </tr>
    `;
         querySnapshot.forEach((doc) => {
            if(doc.data().Estatus == 'Valido'){
                txt += `
                <tr style="text-align: center;" id="${doc.id}">
                <td><img src="${doc.data().Link}" alt="img" style="width: 200px;;height: 200px;"></td>
                <td>${doc.data().Nombre_habito}</td>
                <td>${doc.data().Fecha_de_registro}</td>
                <td>${doc.data().Comentarios}</td>
                <td>Valido</td>
                </tr>
                `;
            }else{
                txt += `
                <tr style="text-align: center;" id="${doc.id}">
                <td><img src="${doc.data().Link}" alt="img" style="width: 200px;;height: 200px;"></td>
                <td>${doc.data().Nombre_habito}</td>
                <td>${doc.data().Fecha_de_registro}</td>
                <td><input type="text" value="${doc.data().Comentarios}"></td>
                <td><button onclick="validarEvidencia('${doc.id}')">Validar</button><br>
                </tr>
                `;
            }
            
        });
            document.getElementById('tabla-evidencias').innerHTML =  txt;
    })
    .catch((error) => {
        console.log("Error getting documents:", error);
    }); 
}

function validarEvidencia(id){
    const arr = id.split('-');
    const id_doc = arr[0]+'-'+arr[1]+'-'+arr[2];
    db.collection("Evidencias").doc(id_doc).update({
        Estatus: 'Valido'
    })
    .then(() => {
        alert('Evidencia Validada');
        getEvidencias(id.split('-')[0]);

    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
}