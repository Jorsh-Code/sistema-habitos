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

let data_evidencia = [10,10,10];

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
        let txt = '<option>-Elija un alumno-</option>';
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
            let txt = '';
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

function getEvidencias(){
    const id = document.getElementById('select-habito').value;
    db.collection("Evidencias").where('Correo','==',id.split('-')[0]).where('Nombre_habito','==',id.split('-')[1])
    .get()
    .then((querySnapshot) => {
        //console.log(querySnapshot.data());
        let ev = 0;
        let env = 0;
        querySnapshot.forEach((doc) => {
            if(doc.data().Estatus == 'Valido'){
                ev++;
            }else{
                env++;
            }
            
        });
        data_evidencia = [ev,env,parseInt(id.split('-')[2])-ev-env];
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
            'Evidencias No Validas',
            'Evidencias Validadas',
            'Evidencias Faltantes'
        ],
        datasets: [{
          label: 'My First Dataset',
          data: data_evidencia,
          backgroundColor: [
            'rgb(255, 99, 132)',
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


