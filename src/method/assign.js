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
    const id_doc = correo+'-'+id_hab[0];
    const Nombre = id_hab[1];
    const Dias = 21;
    const Fecha_de_inicio = '2022-01-01';
    
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
            Periodo: 'Cada 1 día' 
        })
        .then(() => {
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
                <td>${doc.data().Nombre}</td>
                <td style="text-align: justify;">${doc.data().Descripcion}</td>
                <td><input type="text" value="${doc.data().Dias}"></td>
                <td><input type="text" value="${doc.data().Periodo} "></td>
                <td><input type="text" value="${doc.data().Fecha_de_inicio}"></td>
                <td><input type="text" value="${doc.data().Comentarios}"></td>
                <td>
                <button onclick="editarHabito('${doc.id}')">Editar</button>
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
        getHabitosAsignados(Correo);
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}

function editarHabito(id_doc){
    const padre = document.getElementById(id_doc);
    const Nombre = padre.children[0].textContent;
    const Descripcion = padre.children[1].textContent;
    const Dias = padre.children[2].firstChild.value;
    const Periodo = padre.children[3].firstChild.value;
    const Fecha_de_inicio =  padre.children[4].firstChild.value;
    const Comentarios =  padre.children[5].firstChild.value
    const Correo =  id_doc.split('-')[0];
    console.log(Correo);
    db.collection("Habitos_Asignados").doc(id_doc).set({
            Comentarios,
            Correo,
            Descripcion,
            Dias,
            Fecha_de_inicio,
            Nombre,
            Periodo 
    })
    .then(() => {
        getHabitosAsignados(Correo);
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });

}