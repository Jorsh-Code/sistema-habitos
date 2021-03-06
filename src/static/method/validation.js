app.auth().onAuthStateChanged((user) => {
    if (user) {
        db.collection("Grupos").where("estatus", "==", "Habilitado").where('id_profesor','==',id_user)
        .get()
        .then((querySnapshot) => {
            let txt = "";
            let init = true;
            querySnapshot.forEach((doc) => {
                txt += `<option value=${doc.data().id} >${doc.data().grupo}</option>`;
                if(init){ getAlumnos(doc.data().id);init=false; } 
                location.href = '#head';
                //console.log(doc.id, " => ", doc.data());
            });
            document.getElementById('select-grupo').innerHTML =  txt;
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });   
    }else{
        location.href = '/';
    }
});

function getAlumnos(...args){
    //console.log(grupo);
    let grupo;
    args[0] != undefined ? grupo = args[0] : grupo = document.getElementById('select-grupo').value;
    db.collection("Estudiantes").where("id_grupo", "==", grupo).where('Profesor','==',id_user)
    .get()
    .then((querySnapshot) => {
        let txt = '';
        init = true;
        querySnapshot.forEach((doc) => {
            txt += `<option id="${doc.id}" value="${doc.id}" >${doc.data().Nombre}</option>`;
            if(init){ getHabitosAsignados(doc.id); init=false}
            //console.log(doc.id, " => ", doc.data());
        });
            document.getElementById('select-alumno').innerHTML =  txt;
    })
    .catch((error) => {
        console.log("Error getting documents:", error);
    });    
}

function getHabitosAsignados(...args){
    
    args[0] != undefined ? correo = args[0] : correo = document.getElementById('select-alumno').value;
    db.collection("Habitos_Asignados").where("Correo", "==", correo)
        .get()
        .then((querySnapshot) => {
            let txt = '<option>-Elija un habito-</option>';
            querySnapshot.forEach((doc) => {
                txt += `<option id="${doc.id}" value="${doc.id}" >${doc.data().Nombre}</option>`;    
                //console.log(doc.id, " => ", doc.data());
            });
            document.getElementById('select-habito').innerHTML =  txt;
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
    }); 
}


function getEvidencias(){
    const correo = document.getElementById('select-habito').value.split('-')[0];
    const id_hab = document.getElementById('select-habito').value.split('-')[1];
    /*gs://proyecto-joven-uwu.appspot.com/the.hit.boyx@gmail.com/Donar sangre/IMG_20220602_205252.jpg*/
    db.collection("Evidencias").where('Correo','==',correo).where('id_habito','==',id_hab)
    .get()
    .then((querySnapshot) => {
        //console.log(querySnapshot);
        let txt = `
        <tr>
            <th>Evidencia</th>
            <th>Habito</th>
            <th>Fecha de registro</th>
            <th>Comentarios</th>
            <th></th>
        </tr>
        `;
        //console.log(querySnapshot);
        //console.log()
        querySnapshot.forEach((doc) => {
            //console.log(doc.id);
            if(doc.data().Estatus == 'Valido'){
                txt += `
                <tr style="text-align: center;" id="${doc.id}">`
                if(doc.data().Link.search(/\.(jpg|jpeg|png|svg|avif)/) != -1){
                    txt += `<td><img src="${doc.data().Link}" alt="img" style="width: 200px;;height: 200px;"></td>`;
                }else{
                    txt += `<td><a target="_blank" href="${doc.data().Link}">ver documento</a></td>`;
                }
               
               txt += `<td>${doc.data().Nombre_habito}</td>
                <td>${doc.data().Fecha_de_registro}</td>
                <td>${doc.data().Comentarios}</td>
                <td>Valido</td>
                </tr>
                `;
            }else{
                txt += `
                <tr style="text-align: center;" id="${doc.id}">`
                if(doc.data().Link.search(/\.(jpg|jpeg|png|svg|avif)/) != -1){
                    txt += `<td><img src="${doc.data().Link}" alt="img" style="width: 200px;;height: 200px;"></td>`;
                }else{
                    txt += `<td><a target="_blank" href="${doc.data().Link}">ver documento</a></td>`;
                }
               
               txt += `<td>${doc.data().Nombre_habito}</td>
                <td>${doc.data().Fecha_de_registro}</td>
                <td><textarea style="padding:5px" name="" id="Comentarios" cols="30" rows="5" ></textarea></td>
                <td><button onclick="validarEvidencia('${doc.id}','${doc.data().Fecha_de_registro}','${doc.data().Nombre_habito}')">Validar</button><br></td>
                <td><button onclick="rechazarEvidencia('${doc.id}','${doc.data().Fecha_de_registro}','${doc.data().Nombre_habito}')">Rechazar</button><br></td>
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

function validarEvidencia(id,fecha,nombre_hab){
    const arr = id.split('-');
    const id_doc = arr[0]+'-'+arr[1]+'-'+arr[2];
    //notificacion(arr[0],'Fecha de registro: '+fecha,'Evidencia de -'+nombre_hab+'- validada');
    db.collection("Evidencias").doc(id_doc).update({
        Estatus: 'Valido',
        Comentarios: document.getElementById('Comentarios').value
    })
    .then(() => {
        notificacion(arr[0],'Fecha de registro: '+fecha,'Evidencia de -'+nombre_hab+'- validada');
        alert('Evidencia Validada');
        getEvidencias(id.split('-')[0]);

    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
}

function rechazarEvidencia(id,fecha,nombre_hab){
    const arr = id.split('-');
    const id_doc = arr[0]+'-'+arr[1]+'-'+arr[2];
    //notificacion(arr[0],'Fecha de registro: '+fecha,'Evidencia de -'+nombre_hab+'- validada');
    db.collection("Evidencias").doc(id_doc).delete().then(() => {
        notificacion(arr[0],'Fecha de registro: '+fecha,'Evidencia de -'+nombre_hab+'- Rechzada');
        alert('Evidencia Rechazada');
        getEvidencias(id.split('-')[0]);
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
}


async function notificacion(correo,cuerpo,titulo){
 
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
                "body": cuerpo
            }
        })
    }).then(res => res.json())
      .then(data => {
        //console.log(data);
    });
       
}