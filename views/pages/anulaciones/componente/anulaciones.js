var tamanoDeLetras = 11
$(document).ready(function () {

    var selectorUnidadGG = ''
    var unaFechadesde = null
    var unaFechahasta = null


    console.log($("#usuarioLogeado").html())
    var usuarioBajas=$("#usuarioLogeado").html();
    usuarioBajas=usuarioBajas.split("@");
    usuarioBajas=usuarioBajas[0];
     if (usuarioBajas == 'mghislanzoni'){ //prod
    //if (usuarioBajas == 'galtamirano'){ //test
        botones='</br></br>'
        botones+='<div class="col py-3 p-2" id="botonExportar">'
        botones+='    <button type="button" class="btn btn-dark ml-2" onclick=forzadoDiario() id="forzadoDiario">Forzar Diario</button>'
        botones+='    <button type="button" class="btn btn-dark ml-2" onclick=forzadoMensual() id="forzadoMensual">Forzar Mensual</button>'
        botones+='</div>'
        
        $('#contenedorBtn').append(botones)
    }
    


    $('.fechadatepicker').datepicker({
        format: 'dd-mm-yyyy',
        language: 'es',
        endDate: 'date.now()',
        autoclose: true,
    })//.datepicker("setDate", 'now')

    $('#selectorUnidadGG').change(function (event) {
        selectorUnidadGG = $(this).val()
        if (selectorUnidadGG != null) {
            $('#reporteBajas').attr('src','')
            traerDatosParaLaTabla(unaFechadesde, unaFechahasta,selectorUnidadGG)
        }
    })

    $('#cerrarSesion').on('click', function (event) {
        localStorage.clear();
        sessionStorage.clear();
        sesion.remove('token');
        window.location.href = './../'
    })

    $('#fechadesde').change(function (event) {
        unaFechadesde = $(this).val()
        if (unaFechadesde != null && unaFechahasta != null) {
            $('#reporteBajas').attr('src','')
            traerDatosParaLaTabla(unaFechadesde, unaFechahasta,selectorUnidadGG)
        }
    })

    $('#fechahasta').change(function (event) {
        unaFechahasta = $(this).val()
        if (unaFechadesde != null && unaFechahasta != null) {
            $('#reporteBajas').attr('src','')
            traerDatosParaLaTabla(unaFechadesde, unaFechahasta,selectorUnidadGG)
        }
    })

    
    seTerminoDeCargarElReporte()
    cargarSelectores()
});

function seTerminoDeCargarElReporte() {
    $("#loader2").hide();
}

async function cargarSelectores() {
    $("#loader2").show();
    res = await loadSelectNitro4('Razonsocial', 'Cuit', 'Razonsocial', 'selectorUnidadGG', URLSERVICIOSNITRO4 + 'empresasadministradas', '')
    res = await loadSelectNitro4('IdMotivoKtna', 'IdMotivoAfip', 'DescripcionMotivoKtna', URLSERVICIOSNITRO4 + 'motivosBajas', '')
    $("#loader2").hide();
}

function Loadtrigger(){

}

function traerDatosParaLaTabla(unaFechadesde, unaFechahasta,selectorUnidadGG) {
    
    var data = {
        fechadesde : unaFechadesde,
        fechahasta : unaFechahasta,
        cuit_clienteGG : selectorUnidadGG,
        errores : 0

    }
    consultaReportesAnulaciones('consultaReportesAnulaciones',data)

seTerminoDeCargarElReporte()
}
function ponerReporteEnServidor(unaFechadesde, unaFechahasta,selectorUnidadGG) {
    
    var data = {
        fechadesde : unaFechadesde,
        fechahasta : unaFechahasta,
        cuit_clienteGG : selectorUnidadGG,
        errores : 0

    }
    consultaMinioUploadFile('consultaMinioUploadFile',data)

seTerminoDeCargarElReporte()
}


async function buscarDatosSelectores() {
    res = await loadSelect('OSocCodigo', 'OSocNombre', 'obraSocial', URLSERVICIOSVPN + 'ObraSocial', '')
}
function minioPutFile(json, nombreDeLaVistaEnReportingSenter, nombreParaElArchivo) {
    var rutaRS = window.location.protocol+'/report/api/getReport'
    let jsondata = JSON.stringify({
        name: nombreDeLaVistaEnReportingSenter,
        type: "xlsx",
        data: json
    })

    $.ajax({
        "url": rutaRS,
        "headers": { "Content-Type": "application/json" },
        "type": 'POST',
        "data": jsondata,
        success: function (res) {
            
            console.log(res)

        },
        error: function (r) {
            console.log('error'+r)
        }
    });
}
function solicitarXLSJSReport(json, nombreDeLaVistaEnReportingSenter, nombreParaElArchivo) {
    var rutaRS = window.location.protocol+'/report/api/getReport'
    let jsondata = JSON.stringify({
        name: nombreDeLaVistaEnReportingSenter,
        type: "xlsx",
        data: json
    })

    $.ajax({
        "url": rutaRS,
        "headers": { "Content-Type": "application/json" },
        "type": 'POST',
        "data": jsondata,
        success: function (res) {
            console.log(res)
            //document.getElementById('reporteAnulacionesInput').value =res;

            headers2 =[
                'cuil',
                'fecha_baja',
                'id_proceso',
                'codigo_categoria'
            ]
            tablaReportesAnulaciones('tablaAnulacioens',headers2,jsondata)

            $('#reporteAnulaciones').removeAttr('src')
            $('#reporteAnulaciones').attr('src', 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,' + res)
            $('#reporteAnulaciones').removeAttr('src')
            $('#base64').val(res)
            //guardar_respuesta('AnulacionesVidaXLSX.XLSX',res.data);
           // urlMinIO="http://192.168.10.191:9000/tempanulaciones/AnulacionesVidaXLSX.XLSX?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=KLPBYDOWFRRYE0M8VFJK%2F20211104%2Far%2Fs3%2Faws4_request&X-Amz-Date=20211104T174349Z&X-Amz-Expires=604799&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiJLTFBCWURPV0ZSUllFME04VkZKSyIsImV4cCI6MzYwMDAwMDAwMDAwMCwicG9saWN5IjoiY29uc29sZUFkbWluIn0.Z57IANCEcBWPEgsGG7RvP6aRvJgnPuXcup0kfWtK1TH6W-wv_t-MJ-eTf6JucrIlrAwionrKYiZAVZLva_IXYg&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=0400d822465b7aa07bd0a8ed1eb585740ad0d0fd8f98e1bb37b19b8c82bb34a5"

        },
        error: function (r) {
            console.log('error'+r)
        }
    });
}

$('#soliciatarReporteEnExcel').click(function () {
    let base64 = $('#base64').val()
    let pre="data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,";
    //var inp = document.getElementById('reporteAnulacionesInput').value;
    $('#reporteAnulaciones').removeAttr('src')
    $('#reporteAnulaciones').attr('src',pre + base64
)

});

function createJsonReport(jsonBody){
    dato = {
        "resultados": {
            "fecha_inicio": $('#fechadesde').val(),
            "fecha_fin": $('#fechahasta').val(),
            "unidad_gg": $('#selectorUnidadGG').val(),
            "empleados": jsonBody
        }
    }
    let vista = 'BajasVida'
    let nombreXLS= console.log($("#usuarioLogeado").html())+'LSBajasVida.xlsx'
    solicitarPDFJSReport(dato, vista, nombreXLS)
}


function createJsonReportXLSX(jsonBody){
    dato = {
        "resultados": {
            "fecha_inicio": $('#fechadesde').val(),
            "fecha_fin": $('#fechahasta').val(),
            "unidad_gg": $('#selectorUnidadGG').val(),
            "empleados": jsonBody
        }
    }
    console.log(jsonBody)

    let vista = 'AnulacionesVidaXLSX'
    let nombreXLSX= $("#usuarioLogeado").html()+'AnulacionesVida.xlsx'
    solicitarXLSJSReport(dato, vista, nombreXLSX)
}


function forzadoDiario(){
    var form = new FormData();
    form.append("empresa", "1");
    
    var settings = {
      "url": "/servicios/api/importadorbajasdiario",
      "method": "GET",
      "timeout": 0,
      "headers": {
        "Authorization": "Basic bGlvbnM6SnBoMTM1",
        "Content-Type": "application/json",
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MiwiaWF0IjoxNjMyNzU2MzAyLCJ2ZW5jaW1pZW50byI6MTYzNDA1MjMwMiwiZGF0b3NDb25leGlvbiI6eyJtb3Rvcl9kYiI6Im1zc3FsIiwiaG9zdF9kYiI6IjE3Mi4xNi4xMC4zMSIsInBvcnRfZGIiOiIxNDMzIiwibmFtZV9kYiI6IkFEUEJPVCIsInVzZXJfZGIiOiJpbnRlZ3JhZ2ciLCJwYXNzX2RiIjoiMjAyMW50ZWdyYSIsImVudG9ybm8iOiJBRFBCT1QifSwiaWRVc3VhcmlvTml0cm80IjoyLCJ1c3VhcmlvIjoiQ3JvbiJ9.jjc1mcD1ZyWlus-OTMgubbvDOkLsZguSlKrABaIKjzE"
      },
      "processData": false,
      "mimeType": "multipart/form-data",
      "contentType": false,
      "data": form
    };
    
    $.ajax(settings).done(function (response) {
      console.log(response);
    });
}
function forzadoMensual(){
    var form = new FormData();
    form.append("empresa", "1");
    
    var settings = {
      "url": "/servicios/api/importadorbajasmensual",
      "method": "GET",
      "timeout": 0,
      "headers": {
        "Authorization": "Basic bGlvbnM6SnBoMTM1",
        "Content-Type": "application/json",
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MiwiaWF0IjoxNjMyNzU2MzAyLCJ2ZW5jaW1pZW50byI6MTYzNDA1MjMwMiwiZGF0b3NDb25leGlvbiI6eyJtb3Rvcl9kYiI6Im1zc3FsIiwiaG9zdF9kYiI6IjE3Mi4xNi4xMC4zMSIsInBvcnRfZGIiOiIxNDMzIiwibmFtZV9kYiI6IkFEUEJPVCIsInVzZXJfZGIiOiJpbnRlZ3JhZ2ciLCJwYXNzX2RiIjoiMjAyMW50ZWdyYSIsImVudG9ybm8iOiJBRFBCT1QifSwiaWRVc3VhcmlvTml0cm80IjoyLCJ1c3VhcmlvIjoiQ3JvbiJ9.jjc1mcD1ZyWlus-OTMgubbvDOkLsZguSlKrABaIKjzE"
      },
      "processData": false,
      "mimeType": "multipart/form-data",
      "contentType": false,
      "data": form
    };
    
    $.ajax(settings).done(function (response) {
      console.log(response);
    });
}


