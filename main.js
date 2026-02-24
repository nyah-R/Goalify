
class Usuario {
    constructor(usuario, password, idPais) {
        this.usuario = usuario
        this.password = password
        this.idPais = idPais
    }
}

/////////////////////////VARIABLES GLOBALES

let menu = document.querySelector("ion-menu")
let RUTEO = document.querySelector("#ruteo")
let slcObjetivo = document.querySelector("#slcObjetivo")
let fechaSeleccionada = "";

let objetivos = {
    1: { nombre: "Salud", emoji: "&#127973;" },
    2: { nombre: "Finanzas", emoji: "&#128176;" },
    4: { nombre: "Trabajo", emoji: "&#128188;" },
    5: { nombre: "Emocional", emoji: "&#128150;" },
    6: { nombre: "Social", emoji: "&#129309;" },
    7: { nombre: "Aprendizaje", emoji: "&#128218;" },
    8: { nombre: "Descanso", emoji: "&#128164;" }
}

///////////////FUNCIONES OCULTAR-CERRAR COSAS

function ocultarTodoMenu() {
    document.querySelector("#opRegistrarUsuario").style.display = "none"
    document.querySelector("#opLogin").style.display = "none"
    document.querySelector("#opInforme").style.display = "none"
    document.querySelector("#opEvaluacion").style.display = "none"
    document.querySelector("#opListadoEvaluaciones").style.display = "none"
    document.querySelector("#opMapa").style.display = "none"
    document.querySelector("#opLogout").style.display = "none"
    document.querySelector("#opInforme").style.display = "none"
    document.querySelector("#opMapa").style.display = "none"
}

function ocultarTodo() {
    document.querySelector("#pantallaRegistroUsuario").style.display = "none"
    document.querySelector("#pantallaLogin").style.display = "none"
    document.querySelector("#pantallaLogout").style.display = "none"
    document.querySelector("#pantallaEvaluaciones").style.display = "none"
    document.querySelector("#pantallaListado").style.display = "none"
    document.querySelector("#pantallaInforme").style.display = "none"
    document.querySelector("#pantallaMapa").style.display = "none"
}

function cerrarMenu() {
    menu.close()
}

function cerrarSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    ocultarTodo()
    ocultarTodoMenu()
    mostrarMenubasico()
}

function cancelarLogout() {
    ocultarTodo()
}

/////////////////////////////FUNCION NAVEGAR

function navegar(evento) {
    ocultarTodo()
    if (evento.detail.to == "/") document.querySelector("#pantallaHome").style.display = "block"
    if (evento.detail.to == "/login") document.querySelector("#pantallaLogin").style.display = "block"
    if (evento.detail.to == "/registrarUsuario") document.querySelector("#pantallaRegistroUsuario").style.display = "block"
    if (evento.detail.to == "/logout") document.querySelector("#pantallaLogout").style.display = "block"
    if (evento.detail.to == "/evaluaciones") {
        document.querySelector("#pantallaEvaluaciones").style.display = "block";

        const datetime = document.querySelector('#fecha');
        if (datetime) {
            datetime.addEventListener('ionChange', ev => {
                fechaSeleccionada = ev.detail.value.split('T')[0]; //separo la fecha con solo lo que sirve aaaa/mm/dd
            });
        }
    }
    if (evento.detail.to == "/listaEv") document.querySelector("#pantallaListado").style.display = "block"
    if (evento.detail.to == "/informe") document.querySelector("#pantallaInforme").style.display = "block"
    if (evento.detail.to == "/mapa") document.querySelector("#pantallaMapa").style.display = "block"
}

////////////////////FUNCIONES OBTENER COSAS

function obtenerPaises() {
    fetch("https://goalify.develotion.com/paises.php")
        .then(function (response) {
            return response.json()
        })
        .then(function (datos) {
            cargarSelectPaises(datos.paises)
        })
        .catch(function (error) {
            console.log(error)
        })
}

function obtenerObjetivo(id) {
    return objetivos[id] || { nombre: "", emoji: "" }
}

function prepararPantallaRegistroEv() {

    fetch(`https://goalify.develotion.com/objetivos.php`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem("token"),
            'iduser': localStorage.getItem("id")
        }
    })
        .then(function (response) {
            console.log(response)
            return response.json()
        })
        .then(function (informacion) {
            cargarSlcObjetivos(informacion.objetivos)
        })
        .catch(function (error) {
            console.log(error)
        })
}

///////////////////FUNCIONES LIMPIAR CAMPOS

function limpiarCamposR() {
    document.querySelector("#txtNombre").value = ""
    document.querySelector("#txtPassword").value = ""
    document.querySelector("#slcPais").value = ""
}

function limparCamposL() {
    document.querySelector("#txtNombreLogin").value = ""
    document.querySelector("#txtPasswordLogin").value = ""
}

function limpiarCamposEv() {
    slcObjetivo.classList.remove('ion-invalid')
    slcObjetivo.classList.remove('ion-valid')
    slcObjetivo.classList.remove('ion-touched')
    slcObjetivo.value = ""
}

function limpiarEv() {
    limpiarCamposEv()
    document.querySelector('#fecha').value = ""
    document.getElementById('nroCalificacion').value = 0
}

///////////////////////////FUNCION INICIO + BOTONES

function inicio() {
    ocultarTodo()
    obtenerPaises()
    if (localStorage.getItem("token") != null) {
        mostrarMenuVip()
    }
    else {
        mostrarMenubasico()
    }
    RUTEO.addEventListener("ionRouteDidChange", navegar)
    document.querySelector("#btnRegistrar").addEventListener("click", previaRegistrarUser)
    document.querySelector("#btnCerrarSesion").addEventListener("click", cerrarSesion)
    document.querySelector("#btnCancelarLogout").addEventListener("click", cancelarLogout)
    document.querySelector("#btnLogin").addEventListener("click", previaLogin)
    document.querySelector("#opEvaluacion").addEventListener("click", prepararPantallaRegistroEv)
    document.querySelector("#btnGuardarEvaluacion").addEventListener("click", previaRegistrarEv)
    document.querySelector("#opListadoEvaluaciones").addEventListener("click", previaCargarListado)
    document.querySelector("#opInforme").addEventListener("click", previaCargarInforme)
    document.querySelector("#opMapa").addEventListener("click", armarMapaCargarlo)
    document.querySelector("#slcObjetivo").addEventListener('ionChange', validarSelect)
    document.querySelector("#slcObjetivo").addEventListener('ionBlur', validarSelect) //con esto si se pierde el foco tmb aparece el placeholder
    document.querySelector("#limpiarCamposEvaluacion").addEventListener("click", limpiarEv)
}

///////////////////////FUNCIONES MOSTRAR COSAS

function mostrarMenubasico() {
    ocultarTodoMenu()
    document.querySelector("#opRegistrarUsuario").style.display = "block"
    document.querySelector("#opLogin").style.display = "block"
}

function mostrarMenuVip() {
    ocultarTodoMenu()
    document.querySelector("#opInforme").style.display = "block"
    document.querySelector("#opEvaluacion").style.display = "block"
    document.querySelector("#opListadoEvaluaciones").style.display = "block"
    document.querySelector("#opMapa").style.display = "block"
    document.querySelector("#opLogout").style.display = "block"
}

///////////////////////////////FUNCIONES PREVIAS

function previaLogin() {
    let usuarioLog = document.querySelector("#txtNombreLogin").value
    let passwordLog = document.querySelector("#txtPasswordLogin").value

    if (usuarioLog == "" || passwordLog == "") {
        mostrarMensaje("WARNING", "Campos incompletos", "Debes ingresar usuario y contraseña para continuar")
    } else {
        let nuevoLogin = new Object()
        nuevoLogin.usuario = usuarioLog
        nuevoLogin.password = passwordLog
        hacerLogin(nuevoLogin)
        limparCamposL()
    }
}

function previaRegistrarUser() {
    let nombre = document.querySelector("#txtNombre").value
    let password = document.querySelector("#txtPassword").value
    let pais = document.querySelector("#slcPais").value
    if (nombre == "" || password == "" || pais == null) {
        mostrarMensaje("WARNING", "Campos incompletos", "Debe completar todos los campos para registrarse");
    } else {
        let user = new Usuario(nombre, password, pais)
        hacerRegistroNuevoUser(user)
        limpiarCamposR()
    }
}


function previaRegistrarEv() {

    if (!fechaSeleccionada || fechaSeleccionada === "0000-00-00") {
        mostrarMensaje("WARNING", "Fecha inválida", "Debes seleccionar una fecha válida");
        return;
    }
    var idUsuario = localStorage.getItem("id");
    var slcObjetivo = document.querySelector("#slcObjetivo");
    var objetivo = slcObjetivo.value;
    var calificacion = document.querySelector("#nroCalificacion").value;

    if (!objetivo) {
        slcObjetivo.classList.add('ion-touched')
        slcObjetivo.classList.add('ion-invalid')
        return
    }
    else {
        slcObjetivo.classList.add('ion-touched');
        slcObjetivo.classList.add('ion-valid');
    }
    if (calificacion == null) {
        mostrarMensaje("WARNING", "Campos incompletos", "Debe completar calificación y fecha");
        return;
    }
    var evaluacion = new Object();
    evaluacion.idObjetivo = objetivo;
    evaluacion.idUsuario = idUsuario;
    evaluacion.calificacion = calificacion;
    evaluacion.fecha = fechaSeleccionada;
    registrarEvaluacion(evaluacion);
}


function previaCargarListado() {
    fetch(`https://goalify.develotion.com/evaluaciones.php?idUsuario=` + localStorage.getItem("id"), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token"),
            "iduser": localStorage.getItem("id")
        },
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (informacion) {
            hacerListado(informacion.evaluaciones)
        })
        .catch(function (error) {
            console.log(error)
        })
}

function previaCargarInforme() {
    fetch(`https://goalify.develotion.com/evaluaciones.php?idUsuario=` + localStorage.getItem("id"), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token"),
            "iduser": localStorage.getItem("id")
        },
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (informacion) {
            console.log(informacion)
            hacerInforme(informacion.evaluaciones)
        })
        .catch(function (error) {
            console.log(error)
        })
}

////////////////////FUNCIONES REGISTRAR-INGRESAR

function hacerLogin(nuevoLogin) {

    fetch(`https://goalify.develotion.com/login.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoLogin)
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (informacion) {
            console.log(informacion)
            if (informacion.codigo == "200") {
                mostrarMensaje("SUCCESS", "Login exitoso", "Se ha logueado con éxito")
                localStorage.setItem("token", informacion.token)
                localStorage.setItem("id", informacion.id)
                usuarioConectado = informacion.id
                mostrarMenuVip()
                ocultarTodo()
            }
            else {
                mostrarMensaje("ERROR", "Usuario incorrecto", "El usuario o la contraseña no son válidos")
            }
        })
        .catch(function (error) {
            console.log(error)
        })
}

function hacerRegistroNuevoUser(user) {

    fetch(`https://goalify.develotion.com/usuarios.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (informacion) {
            if (informacion.codigo == "200") {
                ocultarTodo()
                document.querySelector("#pantallaHome").style.display = "block"
                localStorage.setItem("token", informacion.token)
                localStorage.setItem("id", informacion.id)
                mostrarMenuVip()
                mostrarMensaje("SUCCESS", "Usuario registrado", "El registro se ha completado correctamente");
            }
            else {
                mostrarMensaje("ERROR", informacion.mensaje);
            }
        })
        .catch(function (error) {
            console.log(error)
        })
}

function registrarEvaluacion(evaluacion) {
    fetch(`https://goalify.develotion.com/evaluaciones.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem("token"),
            'iduser': localStorage.getItem("id")

        },
        body: JSON.stringify(evaluacion)
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (informacion) {
            console.log(informacion)
            if (informacion.codigo == "200") {
                mostrarMensaje("SUCCESS", informacion.mensaje);
                ocultarTodo();
                document.querySelector('ion-router').push('/');
            }
        })
        .catch(function (error) {
            console.log(error)
        })
}

///////////////////////////FUNCIONES CARGAR COSAS

function cargarSelectPaises(listaPaises) {
    const select = document.querySelector("#slcPais");
    select.innerHTML = "" // Limpiar si ya había algos
    for (let unPais of listaPaises) {
        const opcion = document.createElement("ion-select-option")
        opcion.value = unPais.id
        opcion.textContent = unPais.name
        select.appendChild(opcion)
    }
}

function cargarSlcObjetivos(listaObjetivos) {
    const select = document.querySelector("#slcObjetivo");
    select.innerHTML = "" // Limpiar si ya había algos
    for (let unObj of listaObjetivos) {
        const opcion = document.createElement("ion-select-option")
        opcion.value = unObj.id
        opcion.textContent = unObj.nombre
        select.appendChild(opcion)
    }
}

//////////////////////////// FUNCIONES DE LISTADO - INFORME

function hacerListado(evaluaciones) {
    let verLista = ``

    if (evaluaciones.length == 0) {
        verLista = `
                <ion-card color="danger" class="ion-text-center" style="max-width: 400px; margin: 20px auto; padding: 20px; border-radius: 10px;">
                <ion-card-content>
                    <p>No existen evaluaciones registradas.</p>
                    <p>Por favor, complete una evaluación para que pueda visualizarse en este listado.</p>
                </ion-card-content>
            </ion-card>
        `;
    } else {
        for (let unaEv of evaluaciones) {
            let fechaObj = unaEv.fecha
            let objetivo = obtenerObjetivo(unaEv.idObjetivo)
            verLista += `
   <ion-card style="margin: 10px auto; max-width: 400px; border-radius: 10px;">
                <ion-item lines="none">
                    <ion-label style="display: flex; flex-direction: column;">
                        <h2 style="margin: 0 0 5px;"><strong>Calificación: ${unaEv.calificacion}</strong></h2>
                        <h3 style="margin: 0 0 3px;">Fecha: ${fechaObj}</h3>
                        <h3 style="margin: 0;">Objetivo: ${unaEv.idObjetivo}</h3>
                        <h2 style="margin: 0;">${objetivo.emoji} ${objetivo.nombre}</h2>
                    </ion-label>
                    <ion-button color="danger" fill="clear" slot="end" onclick="eliminarEvaluacion(${unaEv.id})">
                        <ion-icon name="trash-outline"></ion-icon>
                    </ion-button>
                </ion-item>
            </ion-card>`
        }
    }
    document.querySelector("#contenedorListado").innerHTML = verLista;
}


function hacerInforme(listaEvaluaciones) {
    let cont = document.querySelector("#contenedorInforme")
    if (listaEvaluaciones.length == 0) {
        cont.innerHTML = `
       <ion-card color="danger" style="border-radius: 10px; max-width: 400px; margin: 20px auto; box-shadow: 0 3px 6px rgba(0,0,0,0.15); ">
        <ion-card-content class="ion-text-center">
              <p>Parece que aún no has registrado evaluaciones. ¡Empieza hoy para poder visualizar tu progreso!</p>
        </ion-card-content>
      </ion-card>
        `;
    }
    else {
        let cantElem = listaEvaluaciones.length
        let totalPuntos = 0
        let totalPuntosHoy = 0;
        let cantElemHoy = 0;
        const hoy = new Date();
        let promedio;
        for (let unElem of listaEvaluaciones) {
            totalPuntos += unElem.calificacion;

            // Extraer año, mes y día del string fecha
            const partes = unElem.fecha.split("-");
            if (partes.length === 3) {
                const anio = parseInt(partes[0], 10);
                const mes = parseInt(partes[1], 10);
                const dia = parseInt(partes[2], 10);

                const hoy = new Date();

                if (
                    anio === hoy.getFullYear() &&
                    mes === (hoy.getMonth() + 1) &&
                    dia === hoy.getDate()
                ) {
                    totalPuntosHoy += unElem.calificacion;
                    cantElemHoy++;
                }
            }
        }
        promedio = (totalPuntos / cantElem).toFixed(2);
        let promedioHoy;
        if (cantElemHoy > 0) {
            promedioHoy = (totalPuntosHoy / cantElemHoy).toFixed(2);
        } else {
            promedioHoy = "No hay evaluaciones hoy";
        }
        cont.innerHTML = `
          <ion-card color="warning"  style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
            <ion-card-header>
                <ion-card-title style="color: white; font-weight: bold; font-size: 20px;">Informe de Evaluaciones</ion-card-title>
            </ion-card-header>
            <ion-card-content>
                <ion-list lines="none">
                    <ion-item>
                        <ion-label class="ion-text-center">
                            <h2>Cantidad de evaluaciones</h2>
                            <p><strong>${cantElem}</strong></p>
                        </ion-label>
                    </ion-item>
                    <ion-item>
                        <ion-label class="ion-text-center">
                            <h2>Promedio de calificaciones</h2>
                            <p><strong>${promedio}</strong></p>
                        </ion-label>
                    </ion-item>
                     <ion-item>
                        <ion-label class="ion-text-center">
                            <h2>Puntaje diario</h2>
                            <p><strong>${promedioHoy}</strong></p>
                        </ion-label>
                    </ion-item>
                </ion-list>
            </ion-card-content>
        </ion-card>
    `;
    }
}

///////////////////////////MENSAJE

function mostrarMensaje(tipo, titulo, texto, duracion) {
    const toast = document.createElement('ion-toast');
    toast.header = titulo;
    toast.message = texto;
    if (!duracion) {
        duracion = 1600;
    }
    toast.duration = duracion;
    if (tipo === "ERROR") {
        toast.color = 'danger';
        toast.icon = "alert-circle-outline";
    } else if (tipo === "WARNING") {
        toast.color = 'warning';
        toast.icon = "warning-outline";
    } else if (tipo === "SUCCESS") {
        toast.color = 'success';
        toast.icon = "checkmark-circle-outline";
    }
    document.body.appendChild(toast);
    toast.present();
}

/////////////////ELIMINAR EVALUACION

function eliminarEvaluacion(idEv) {
    fetch(`https://goalify.develotion.com/evaluaciones.php?idEvaluacion=` + idEv, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            "token": localStorage.getItem("token"),
            "iduser": localStorage.getItem("id")
        },
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (informacion) {
            console.log(informacion)
            if (informacion && informacion.error) {
                throw informacion.error;
            } else {
                previaCargarListado();
            }
        })
        .catch(function (error) {
            console.log(error)
        })
}

/////////// FUNCION ARMAR MAPA Y CARGARLO - MARCAR PUNTOS

function armarMapaCargarlo() {

    let map = L.map('map', { attributionControl: false }).setView([-33.11651, -58.31067], 3);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 6,
        attribution: ''
    }).addTo(map);

    // Primero, obtengo la lista completa de países con sus coordenadas
    fetch('https://goalify.develotion.com/paises.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem("token"),
            'iduser': localStorage.getItem("id")
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (datosPaises) {
            // Después, obtengo la cantidad de usuarios por país
            fetch('https://goalify.develotion.com/usuariosPorPais.php', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'token': localStorage.getItem("token"),
                    'iduser': localStorage.getItem("id")
                }
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (datosUsuarios) {
                    // Combinar datos y marcar en el mapa
                    marcarPuntosMapa(datosPaises.paises, datosUsuarios.paises, map);
                })
                .catch(function (error) {
                    console.log('Error usuarios por país:', error);
                });
        })
        .catch(function (error) {
            console.log('Error países:', error);
        });
}

function marcarPuntosMapa(listaPaises, listaUsuarios, map) {
    for (var i = 0; i < listaPaises.length; i++) {
        var pais = listaPaises[i];
        var cantidad = 0;
        for (var j = 0; j < listaUsuarios.length; j++) {
            if (listaUsuarios[j].id === pais.id) {
                cantidad = listaUsuarios[j].cantidadDeUsuarios;
            }
        }

        if (pais.latitude && pais.longitude) {
            var marker = L.marker([pais.latitude, pais.longitude]).addTo(map);
            marker.bindPopup("<b>" + pais.name + "</b><br>Cantidad de usuarios: " + cantidad);
        }
    }
}

/////////////////////////////////////// VALIDACIÓNES

function validarSelect() { // el select de evaluaciones
    if (slcObjetivo.value) {
        slcObjetivo.classList.add('ion-valid');
        slcObjetivo.classList.remove('ion-invalid');
    } else {
        slcObjetivo.classList.add('ion-invalid');
        slcObjetivo.classList.remove('ion-valid');
        slcObjetivo.classList.add('ion-touched');
    }
}

////////////////////////////////////// INICIO

inicio()
