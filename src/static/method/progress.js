let data_evidencia = [10,10];
let lista_correos = [];

app.auth().onAuthStateChanged((user) => {
    if (user) {
        db.collection("Grupos").where("estatus", "==", "Habilitado").where('id_profesor','==',id_user)
        .get()
        .then((querySnapshot) => {
            let txt = "";
            let init = true;
            querySnapshot.forEach((doc) => {
                txt += `<option value=${doc.data().id} >${doc.data().grupo}</option>`;
                if(init){ getAlumnos(doc.data().id); getHabitosGrupal(doc.data().id);init=false; } 
                //console.log(doc.id, " => ", doc.data());
            });
            document.getElementById('select-grupo').innerHTML =  txt;
            document.getElementById('select-grupo-grupal').innerHTML =  txt;
            location.href = '#head';
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });   
    }else{
        location.href = '/';
    }
});


async function getHabitosGrupal(...args){
    lista_correos = [];
    let grupo;
    let habitos = [];
    let asignados = []; 
    let dias = [];
    let cont = 0;
    let stop = 0;
    args[0] != undefined ? grupo = args[0] : grupo = document.getElementById('select-grupo-grupal').value;
    //console.log(grupo);
    document.getElementById('select-habito-grupal').innerHTML = '<option>-Seleccione un habito-</option>';
    const alumnos = await db.collection("Estudiantes").where("id_grupo", "==", grupo).where('Profesor','==',id_user).get();
    alumnos.forEach(async (alumno) => {
        cont++;
    });
    alumnos.forEach(async (alumno) => {
        lista_correos.push(alumno.id);
        let habitos_a = await db.collection("Habitos_Asignados").where("Correo", "==", alumno.id).get();
        habitos_a.forEach((hab) => {
            if(habitos.indexOf(hab.data().Nombre) != -1){
                asignados[habitos.indexOf(hab.data().Nombre)] += 1;
                dias[habitos.indexOf(hab.data().Nombre)] += parseInt(hab.data().Dias);
            }else{
                habitos.push(hab.data().Nombre);
                asignados.push(1);
                dias.push(parseInt(hab.data().Dias));
            }
            //console.log(hab.data().Nombre);
        });
        stop++;
        if(stop == cont){
            let txt = '<option>-Seleccione un habito-</option>';
            for(let i=0;i<habitos.length;i++){
                txt += `'<option value="${habitos[i]+'-'+asignados[i]+'-'+dias[i]}">${habitos[i]}</option>';`;
            }
            document.getElementById('select-habito-grupal').innerHTML =  txt;
        }
    });

    
    //console.log(habitos,asignados,dias,id_hab);
    //console.log();

}



function getAlumnos(...args){
    //console.log(grupo);
    let grupo;
    args[0] != undefined ? grupo = args[0] : grupo = document.getElementById('select-grupo').value;
    document.getElementById('select-habito').innerHTML = '';
    document.getElementById('select-habito').style.opacity = '0';
    document.getElementById('canva').innerHTML = '';
    db.collection("Estudiantes").where("id_grupo", "==", grupo).where('Profesor','==',id_user)
    .get()
    .then((querySnapshot) => {
        let txt = '<option>-Seleccione un alumno-</option>';
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

function getHabitosAsignados(...args){
    let correo;
    args[0] != undefined ? correo = args[0] : correo = document.getElementById('select-alumno').value;
    db.collection("Habitos_Asignados").where("Correo", "==", correo)
        .get()
        .then((querySnapshot) => {
            let txt = '<option>-Seleccione un habito-</option>';
            querySnapshot.forEach((doc) => {
                txt += `
                <option id="${doc.id}" value="${correo+'-'+doc.data().Nombre+'-'+doc.data().Dias}">${doc.data().Nombre}</option>
                `;    
                
            });
            document.getElementById('select-habito').innerHTML =  txt;
            document.getElementById('select-habito').style.opacity = '1';
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
    }); 
}

async function getEvidenciasGrupal(){
    const id = document.getElementById('select-habito-grupal').value;
    let cont = 0;
    //console.log(lista_correos[0],id.split('-')[0]);
    for(let i = 0; i<lista_correos.length;i++){
        let evidencias = await db.collection("Evidencias").where('Correo','==',lista_correos[i]).where('Nombre_habito','==',id.split('-')[0]).where('Estatus','==','Valido').get();
        evidencias.forEach((evi) => {
            cont++;
            //console.log(evi.id);
        });
    }
    data_evidencia = [cont,parseInt(id.split('-')[2])-cont];
    document.getElementById('canva').style.display = 'block' ;
    document.getElementById('canva').innerHTML = 
    `<h1 id="titulo-grafica">${id.split('-')[0]}</h1>
     <h2>Alumnos: ${id.split('-')[1]}</h2>
    <canvas id="myChart" style="box-sizing: border-box;"></canvas>
    `;
    crearGrafica();
}


function getEvidencias(){
    const id = document.getElementById('select-habito').value;
    db.collection("Evidencias").where('Correo','==',id.split('-')[0]).where('Nombre_habito','==',id.split('-')[1])
    .get()
    .then((querySnapshot) => {
        //console.log(querySnapshot.data());
        let ev = 0;
        querySnapshot.forEach((doc) => {
            if(doc.data().Estatus == 'Valido'){
                ev++;
            }
        });
        data_evidencia = [ev,parseInt(id.split('-')[2])-ev];
        document.getElementById('canva').style.display = 'block' ;
        document.getElementById('canva').innerHTML = `<h1 id="titulo-grafica">${id.split('-')[1]}</h1>
        <canvas id="myChart" style="box-sizing: border-box;"></canvas>
        `;
        crearGrafica();
    })
    .catch((error) => {
        console.log("Error getting documents:", error);
    }); 
}


function crearGrafica(){
    const data = {
        labels: [
            'Evidencias Validadas',
            'Evidencias Faltantes'
        ],
        datasets: [{
          label: 'My First Dataset',
          data: data_evidencia,
          backgroundColor: [
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 10
        }]
      };
    
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
      });
}

function menuGrupal(){
    document.getElementById('seleccion-alumno').style.display = 'none';
    document.getElementById('seleccion-grupal').style.display = 'block';
    document.getElementById('canva').innerHTML = '';
}

function menuAlumno(){
    document.getElementById('seleccion-alumno').style.display = 'block';
    document.getElementById('seleccion-grupal').style.display = 'none';
    document.getElementById('canva').innerHTML = '';
}
