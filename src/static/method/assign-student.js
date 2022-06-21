app.auth().onAuthStateChanged((user) => {
    if (user) {
        db.collection("Grupos").where("estatus", "==", "Habilitado").where('id_profesor','==',id_user)
        .get()
        .then((querySnapshot) => {
            let txt = "";
            let init = 1;
            querySnapshot.forEach((doc) => {
                txt += `<option value=${doc.data().id}>${doc.data().grupo}</option>`;
                if(init===1){ getAlumnos(doc.data().id); init++; } 
                //console.log(doc.id, " => ", doc.data());
            });
            document.getElementById('select-grupo').innerHTML =  txt;
            location.href = '#head';
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });   
    }else{
        location.href = '/';
    }
});

function getAlumnos(...args){
    let grupo;
    args[0] != undefined ? grupo = args[0] : grupo = document.getElementById('select-grupo').value;
    //console.log(grupo);
    db.collection("Estudiantes").where("id_grupo", "==", grupo).where('Profesor','==',id_user)
    .get()
    .then((querySnapshot) => {
        let txt = '<option>-Elija un alumno-</option>';
        querySnapshot.forEach((doc) => {
            txt += `<option id="${doc.id}" value="${doc.id}">${doc.data().Nombre}</option>`;
            //console.log(doc.id, " => ", doc.data());
        });
            document.getElementById('select-alumno').innerHTML =  txt;
    })
    .catch((error) => {
        console.log("Error getting documents:", error);
    });    
}

function getDataEstudiantes(){
    const id_doc = document.getElementById('select-alumno').value;
    document.getElementById('nombre-estudiante').innerText = document.getElementById(id_doc).textContent;
    document.getElementById('regresar').style.display = 'block';
    getBieps(id_doc);
    getGruposHabitos(id_doc);
    getHabitosAsignados(id_doc);

}

function getBieps(id_doc){
    
    db.collection("Bieps").doc(id_doc)
    .get()
    .then((data) => {
        let txt = `
            <tr>
                <th>Biep 1</th>
                <th>Biep 2</th>
                <th>Biep 3</th>
                <th>Biep 4</th>
            </tr>
            <tr style="text-align: justify;">
        `;
        
        //let x = 0;
        //const colors = ['red','green','blue',]
        for(biep in data.data()){
            txt += `<td>${data.data()[biep]}</td>`;
        }
        txt += '</tr>';
        document.getElementById('tabla-bieps').innerHTML = txt;
        document.getElementById('tabla-bieps').style.display = 'block';

            
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });  


}

function getGruposHabitos(id_doc){
    
    db.collection("Habitos")
    .get()
    .then((querySnapshot) => {
        let txt = '<select onchange="getHabitos()" id="select-grupo-habitos" >';
        let init = 0;
        querySnapshot.forEach((doc) => {
            txt += `<option value="${doc.id}">${doc.id}</option>`;
            if(init===0) getHabitos(doc.id); init++;
        });
        txt += `</select> <select id="select-habito"> </select> <br> <button onclick="asinarHabito('${id_doc}')">Asignar</button>`;
        document.getElementById('seleccion').innerHTML =  txt;
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    }); 
}

function getHabitos(...args){
    let id_doc;
    args[0] != undefined ? id_doc = args[0] : id_doc = document.getElementById('select-grupo-habitos').value;
    db.collection("Habitos").doc(id_doc)
    .get()
    .then((data) => {
        let txt = '';
        let x = 0;
        for(hab in data.data()){
            txt += `<option value="${data.data()[hab].Id_habito+'-'+hab+'-'+id_doc}">${hab}</option>`;
        }
        document.getElementById('select-habito').innerHTML = txt;   
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    }); 
}

function asinarHabito(correo){
    const id_hab = document.getElementById('select-habito').value.split('-');
    const id_doc = correo+'-'+id_hab[0];
    const Nombre = id_hab[1];
    const Dias = 21;
    const Fecha_de_inicio = getFecha();
    let Descripcion = '';
    db.collection("Habitos").doc(id_hab[2])
    .get()
    .then((data) => {
        for(habs in data.data()){
            if(habs == id_hab[1]) {
                Descripcion = data.data()[hab].Descripcion;
                break;
            }
        }
        db.collection("Habitos_Asignados").doc(id_doc).set({
            Comentarios: '',
            Correo: correo,
            Descripcion,
            Dias,
            Fecha_de_inicio,
            Nombre,
            Periodo: '1',
            Id_Hab: id_hab[0] 
        })
        .then(() => {
            notificacion(correo,Nombre,'Habito asignado');
            getHabitosAsignados(correo);
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });

    })
    .catch((error) => {
        console.log("Error getting documents:", error);
    }); 
    
    //console.log(ref);
}

function getHabitosAsignados(correo){
    db.collection("Habitos_Asignados").where("Correo", "==", correo)
        .get()
        .then((querySnapshot) => {
            let txt = `           
            <tr style="text-align: center;">
                <th>Habito</th>
                <th>Decripción</th>
                <th>Dias</th>
                <th>Periodo</th>
                <th>Fecha de inicio</th>
                <th>Comentarios</th>
                <th></th>
            </tr>
            `;
            querySnapshot.forEach((doc) => {
                txt += `
                <tr style="text-align: center;" id="${doc.id}">
                <td >${doc.data().Nombre}</td>
                <td ><div style="text-align: justify; height: 150px; width: 150px; overflow: scroll; margin:0">${doc.data().Descripcion}</div></td>
                <td>Por <input type="number" style="width: 35px;height: 30px;" value="${doc.data().Dias}">días</td>
                <td>Cada <input type="number" style="width: 35px;height: 30px;" value="${doc.data().Periodo}">días</td>
                <td><input type="date" value="${doc.data().Fecha_de_inicio}"></td>
                <td><textarea style="padding:5px" name="" id="Comentarios" cols="30" rows="5" >${doc.data().Comentarios}</textarea></td>
                <td>
                <button onclick="editarHabito('${doc.id}')">Actualizar</button>
                <button onclick="eliminarHabito('${doc.id}')">Eliminar</button></td>
                </tr>
                `;    
                //console.log(doc.id, " => ", doc.data());
            });
            document.getElementById('tabla-habitos-asignados').innerHTML =  txt;
            document.getElementById('tabla-habitos-asignados').style.display = 'block';
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
    }); 
}

function eliminarHabito(id_doc){
    const Correo =  id_doc.split('-')[0];
    db.collection("Habitos_Asignados").doc(id_doc).delete().then(() => {
        alert('Habito Eliminado');
        getHabitosAsignados(Correo);
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}

function editarHabito(id_doc){
    const padre = document.getElementById(id_doc);
    const Nombre = padre.children[0].textContent;
    const Descripcion = padre.children[1].textContent;
    const Dias = padre.children[2].children[0].value;
    const Periodo = padre.children[3].children[0].value;
    const Fecha_de_inicio =  padre.children[4].firstChild.value;
    const Comentarios =  padre.children[5].firstChild.value
    const Correo =  id_doc.split('-')[0];
    const Id_Hab = id_doc.split('-')[1];
    db.collection("Habitos_Asignados").doc(id_doc).set({
            Comentarios,
            Correo,
            Descripcion,
            Dias,
            Fecha_de_inicio,
            Nombre,
            Periodo,
            Id_Hab
    })
    .then(() => {
        notificacion(Correo,Nombre,'¡Se han hecho actualizaciones en un habito!');
        alert('Habito Actualizado');
        getHabitosAsignados(Correo);
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });

}

async function notificacion(correo,habito,titulo){
    const alumno = await db.collection("Estudiantes").doc(correo).get();
    const token  = alumno.data().Token;
    fetch('https://fcm.googleapis.com/fcm/send',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'key=AAAA6RTINRg:APA91bFWJDe3AZLJg4_bCJrEsUkGn8TVSf6S7RQMwpPM6mM54nvt_kobLq_u5rRTNeVNYY5ZpOf2JSOSk90YvvVEUB-4x-pvP-q0O7euLUVra9iKKXxm76ixjlGIg-PfrnBcGucCezVK '
        },
        body: JSON.stringify({
            "to": token,
            "notification": {
                "title": titulo,
                "body": habito 
            }
        })
    }).then(res => res.json())
      .then(data => {
        console.log(data);
    });
    
    
}

function getFecha(){
    let now = new Date();
    let month = (now.getMonth() + 1);               
    let day = now.getDate();
    if (month < 10) 
        month = "0" + month;
    if (day < 10) 
        day = "0" + day;
    return now.getFullYear() + '-' + month + '-' + day;
}