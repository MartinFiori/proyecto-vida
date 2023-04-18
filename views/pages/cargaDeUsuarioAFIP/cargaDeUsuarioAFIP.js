var datos = {}
var tamanoDeLetras = 11
var errores = []
var iderrores = []
var intervaloDevalidacionDeCampos


$(document).ready(function () {

    $("#nombreDelUsuario").html(sesion.get('usuarioLogueado'))

    limpiarCampos()

    $("#CUIL").inputmask("99-99999999-9").on('blur', function () {
        validarCampos()
        validarFormatoCuitOCuil("CUIL")
    });

    $("#contra").on('blur', function () {
        validarCampos()
    });

    $("#area").on('change', function () {
        validarCampos()
    });

    $('.autocomplete').select2({
        with:"auto",
        theme: 'bootstrap4'
    });



    $("#cargarDatos").on('click', function (event) {
        if (validarCampos()) {
            actualizarValores()
        }
    })

    $("#cerrarSesion").on('click', function (event) {
        localStorage.clear();
        sessionStorage.clear();
        sesion.remove('token');
        window.location.href = "./../"
    })
});

function limpiarCampos() {
    $("#CUIL").val('')
    $("#contra").val('')
    $("#area").val('').trigger('change')
}

function validarFormatoCuitOCuil(val) {
    if (!($("#" + val).val().replaceAll('_', '').replaceAll('-', '').length == 11)) {
        errores.push(val + ' ')
        iderrores.push(val)
        document.getElementById(val).style.background = '#e59191';
    } else {
        document.getElementById(val).style.background = 'none';
    }
}

function limpiarcolores() {
    ['CUIL', 'contra', 'select2-area-container'].forEach(element => {
        console.log(element)
        document.getElementById(element).style.background = 'none';
        if (document.querySelector('[aria-labelledby="' + element + '"]')) {
            document.querySelector('[aria-labelledby="' + element + '"]').style.background = 'none'
        }
    });
}

function validarCampos() {
    limpiarcolores()
    errores = []
    iderrores = []

    // esVacio('CUIL', 'CUIL')
    validarFormatoCuitOCuil("CUIL")
    esVacio('contra', 'Contraseña')
    esVacioSelect('area', 'Area', 'select2-area-container')

    if ($('#contra').val().length < 6 && $('#contra').val() != '') {
        errores.push('Contraseña')
        iderrores.push('contra')
    }

    if (errores.length == 0) {
        $("#camposFaltantes").html('<p style="color:#1fd420;font-size: ' + tamanoDeLetras + 'px">Campos completos</p>')
        return true
    }

    if (errores.length == 1) {
        $("#camposFaltantes").html('<p style="color:#ff0018;font-size: ' + tamanoDeLetras + 'px ">Complete el siguiente campo: ' + errores + '</p>')
        iderrores.forEach(element => {
            document.getElementById(element).style.background = '#e59191';
        });
    }
    if (errores.length > 1) {
        $("#camposFaltantes").html('<p style="color:#ff0018;font-size: ' + tamanoDeLetras + 'px " >Complete los siguientes campos: ' + errores + '</p>')
        iderrores.forEach(element => {
            document.getElementById(element).style.background = '#e59191';
            if (document.querySelector('[aria-labelledby="' + element + '"]')) {
                document.querySelector('[aria-labelledby="' + element + '"]').style.background = '#e59191'
            }
        });
    }
}

var actualizarValores = async function () {
    var data = {}

    data.nombre = sesion.get('usuarioLogueado')
    data.cuil = $('#cuil').val()
    data.clave = $('#contra').val()
    data.area = $('#area').val()
    data.vencida = 0

    await ejecutarActualizacionDatos(data)
}

var ejecutarActualizacionDatos = async function (data) {
    var respuestaDeExistencia = await getDato()
    var respuestaDeBDD
    if (respuestaDeExistencia.resultados) {
        if (respuestaDeExistencia.resultados.idNitro4) {
            respuestaDeBDD = await updateDato(respuestaDeExistencia.resultados.idNitro4,data)
        } 
    }else {
        respuestaDeBDD = await insertNuevoDato(data)
    }
    window.location.href = "./validacion/"
}

var getDato = async function () {
    return await ejecutarAjax('usuariosafip_filtrar', 'POST', { nombre: sesion.get('usuarioLogueado'), filtroNitro4: true })
}

var updateDato = async function (idNitro4, data) {
    return await ejecutarAjax('/usuariosafip/'+idNitro4, 'PUT', data)
}

var insertNuevoDato = async function (data) {
    return await ejecutarAjax('usuariosafip', 'POST', data)
}

var ejecutarAjax = async function (url, tipo, data = {}) {
    return $.ajax({
        "url": URLSERVICIOSNITRO4 + url,
        "headers": HeaderNitro,
        "type": tipo,
        "async": false,
        "data": data,
        error: function (error) {
            console.log(error);
        }
    });
}