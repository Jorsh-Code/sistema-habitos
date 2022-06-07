app.auth().onAuthStateChanged((user) => {
    if (user) {
        db.collection("Grupos").where("estatus", "==", "Habilitado").where('id_profesor','==',id_user)
        .get()
        .then((querySnapshot) => {
            let txt = "";
            let init = 1;
            querySnapshot.forEach((doc) => {
                txt += `<option value=${doc.data().id} onclick="getAlumnos('${doc.data().id}')">${doc.data().grupo}</option>`;
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

function getAlumnos(grupo){
    //console.log(grupo);
    db.collection("Estudiantes").where("id_grupo", "==", grupo).where('Profesor','==',id_user)
    .get()
    .then((querySnapshot) => {
        let txt = "";
        querySnapshot.forEach((doc) => {
            txt += `<option id="${doc.id}" value="${doc.id}" onclick="getDataEstudiantes('${doc.id}')">${doc.data().Nombre}</option>`;
            //console.log(doc.id, " => ", doc.data());
        });
            document.getElementById('select-alumno').innerHTML =  txt;
    })
    .catch((error) => {
        console.log("Error getting documents:", error);
    });    
}

function getDataEstudiantes(id_doc){
    document.getElementById('nombre-estudiante').innerText = document.getElementById(id_doc).textContent;
    getBieps(id_doc);
    getGruposHabitos();
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
        let txt = '<select>';
        let init = 0;
        querySnapshot.forEach((doc) => {
            txt += `<option value=${doc.id} onclick="getHabitos('${doc.id}')">${doc.id}</option>`;
            if(init===0) getHabitos(doc.id); init++;
        });
        txt += `</select> <select id="select-habito"> </select> <br> <button onclick="asinarHabito('${id_doc}')">Asignar</button>`;
        document.getElementById('seleccion').innerHTML =  txt;
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    }); 
}

function getHabitos(id_doc){
    db.collection("Habitos").doc(id_doc)
    .get()
    .then((data) => {
        let txt = '';
        let x = 0;
        for(hab in data.data()){
            txt += `<option value="${data.data()[hab].Id_habito+'-'+hab+'-'+id_doc}">${hab}</option>`;
           /* x++;
            console.log(data.data()[hab].Id_habito+'  '+hab);
            if(x==10)break;*/
        }
        document.getElementById('select-habito').innerHTML = txt;   
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    }); 
}

function asinarHabito(correo){
    const id_hab = document.getElementById('select-habito').value.split('-');
    const id_doc = correo+'-'+id_hab[1];
    const Nombre = id_hab[1];
    const Dias = 21;
    const Fecha_de_inicio = new Date();
    
    let Descripcion = '';
    db.collection("Habitos").doc(id_hab[2])
    .get()
    .then((data) => {
        //console.log(data.data());
        for(habs in data.data()){
            if(habs == id_hab[1]) Descripcion = data.data()[hab].Descripcion;
            break;
        }

    })
    .catch((error) => {
        console.log("Error getting documents:", error);
    }); 
    
    //console.log(ref);
}

function getHabitosAsignados(correo){
    console.log('correo '+correo);
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
                <td>${doc.data().Nombre}</td>
                <td style="text-align: justify;">${doc.data().Descripcion}</td>
                <td>${doc.data().Dias}</td>
                <td>${doc.data().Periodo}</td>
                <td>${doc.data().Fecha_de_inicio}</td>
                <td>${doc.data().Comentarios}</td>
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