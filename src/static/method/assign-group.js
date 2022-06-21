app.auth().onAuthStateChanged((user) => {
    if (user) {
        //console.log(id_user);
        db.collection("Grupos").where("estatus", "==", "Habilitado").where('id_profesor','==',id_user)
        .get()
        .then((querySnapshot) => {
            let txt = '';
            let init = true;
            
            querySnapshot.forEach((doc) => {
                txt += `<option value=${doc.data().id}>${doc.data().grupo}</option>`;
                if(init){ getGruposHabitos(); init = false;} 
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

function getGruposHabitos(){
    
    db.collection("Habitos")
    .get()
    .then((querySnapshot) => {
        let txt = '';
        let init = true;
        querySnapshot.forEach((doc) => {
            txt += `<option value="${doc.id}">${doc.id}</option>`;
            if(init) {getHabitos(doc.id); init = false;}
        });
        document.getElementById('select-grupo-habitos').innerHTML =  txt;
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
            txt += `<option value="${data.data()[hab].Id_habito+'-'+hab}">${hab}</option>`;
        }
        document.getElementById('select-habito').innerHTML = txt;   
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    }); 
}


async function asignarHabito(){
    const id_grupo = document.getElementById('select-grupo').value;
    const id_habito = document.getElementById('select-habito').value.split('-')[0];
    const Nombre = document.getElementById('select-habito').value.split('-')[1];
    const Fecha_de_inicio = document.getElementById('Fecha-de-inicio').value;
    const Periodo = document.getElementById('Periodo').value;
    const Dias = document.getElementById('Dias').value;
    const Comentarios = document.getElementById('Comentarios').value; 
    let Descripcion = '';

    const data = await db.collection("Habitos").doc(document.getElementById('select-grupo-habitos').value).get()
    for(habs in data.data()){
        if(habs == Nombre) {
            Descripcion = data.data()[hab].Descripcion;
            break;
        }
    }

    const emails =  await db.collection("Estudiantes").where('id_grupo','==',id_grupo).get();
    
    emails.forEach((doc) => {
        let id_doc = doc.id + '-' + id_habito;
        //console.log(id_doc);
        db.collection("Habitos_Asignados").doc(id_doc).set({
            Comentarios,
            Correo: doc.id,
            Descripcion,
            Dias,
            Fecha_de_inicio,
            Nombre,
            Periodo,
            Id_Hab: id_habito 
        })
        .then(() => {
            notificacion(doc.id,Nombre);
        })
        .catch((error) => {
            alert("Error writing document: ", error);
        });
    });

    alert('Habito asignado a todo el grupo');
    document.getElementById('Fecha-de-inicio').value = '';
    document.getElementById('Periodo').value = '1';
    document.getElementById('Dias').value = '21';
    document.getElementById('Comentarios').value = ''; 
}


async function notificacion(correo,habito){
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
                "title": "Habito asignado",
                "body": habito 
            }
        })
    }).then(res => res.json())
      .then(data => {
        //console.log(data);
    });
    
    
}