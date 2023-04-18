var tamanoDeLetras = 11
$(document).ready(function () {

    var selectorUnidadGG = ''
    var unaFechadesde = null
    var unaFechahasta = null
    var selectorMotivoBaja= ''


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
            traerDatosParaLaTabla(unaFechadesde, unaFechahasta,selectorUnidadGG,selectorMotivoBaja)
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
            traerDatosParaLaTabla(unaFechadesde, unaFechahasta,selectorUnidadGG,selectorMotivoBaja)
        }
    })

    $('#fechahasta').change(function (event) {
        unaFechahasta = $(this).val()
        if (unaFechadesde != null && unaFechahasta != null) {
            $('#reporteBajas').attr('src','')
            traerDatosParaLaTabla(unaFechadesde, unaFechahasta,selectorUnidadGG,selectorMotivoBaja)
        }
    })
    $('#selectorMotivoBaja').change(function (event) {
        selectorMotivoBaja = $(this).val()
        if (selectorMotivoBaja != null) {
            $('#reporteBajas').attr('src','')
            traerDatosParaLaTabla(unaFechadesde, unaFechahasta,selectorUnidadGG,selectorMotivoBaja)
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
    res = await loadSelectNitro4('IdMotivoKtna', 'IdMotivoAfip', 'DescripcionMotivoKtna', 'selectorMotivoBaja', URLSERVICIOSNITRO4 + 'motivosBajas', '')
    $("#loader2").hide();
}

function Loadtrigger(){

}

function traerDatosParaLaTabla(unaFechadesde, unaFechahasta,selectorUnidadGG,selectorMotivoBaja) {
    
    var data = {
        fechadesde : unaFechadesde,
        fechahasta : unaFechahasta,
        cuit_clienteGG : selectorUnidadGG,
        motivo_baja : selectorMotivoBaja,
        errores : 0

    }
    consultaReportesBajas('consultaReportesBajas',data)

seTerminoDeCargarElReporte()
}

async function buscarDatosSelectores() {
    res = await loadSelect('OSocCodigo', 'OSocNombre', 'obraSocial', URLSERVICIOSVPN + 'ObraSocial', '')
}

function solicitarPDFJSReport(json, nombreDeLaVistaEnReportingSenter, nombreParaElArchivo) {
    var rutaRS = window.location.protocol+'/report/api/getReport'
    let jsondata = JSON.stringify({
        name: nombreDeLaVistaEnReportingSenter,
        type: "pdf",
        data: json
    })

// function solicitarXLSJSReport(json, nombreDeLaVistaEnReportingSenter, nombreParaElArchivo) {
//     var rutaRS = window.location.protocol+'/report/api/getReport'
//     let jsondata = JSON.stringify({
//         name: nombreDeLaVistaEnReportingSenter,
//         type: "xlsx",
//         data: json
//     })

    $.ajax({
        "url": rutaRS,
        "headers": { "Content-Type": "application/json" },
        "type": 'POST',
        "data": jsondata,
        success: function (res) {
            $('#reporteBajas').removeAttr('src')
            $('#reporteBajas').attr('src', 'data:application/pdf;base64,' + res)
            console.log(res)
            // var Minio = require('minio')

            // var minioClient = new Minio.Client({
            //     endPoint: '192.168.10.191',
            //     port: 9000,
            //     useSSL: false,
            //     accessKey: 'H3QTEY255Z0036RU306X',
            //     secretKey: 'mBSB5ZH84o+VR99AADT6sCUn9vs6yKC4BBB+pymQ'
            // });

            // minioClient.listBuckets(function(err, buckets) {
            //     if (err) return console.log(err)
            //     console.log('buckets :', buckets)
            // })
            
            // var file = process.cwd()+'/bajas.xlsx'
            // var metaData = {
            // 'Content-Type': 'xlsx',
            // }
            // minioClient.fPutObject(res, 'baja.pdf', file, metaData, function(err, objInfo) {
            //     if(err) {
            //         return console.log(err)
            //     }
            //     console.log("Success", objInfo.etag, objInfo.versionId)
            // })
            // //http://docs.google.com/gview?url=[rutacompleta].xls&embedded=true

            $('#reporteBajas').removeAttr('src')
            $('#reporteBajas').attr('src', 'data:application/pdf;base64,' + res)
            console.log(res)
            var elementoXLSX=solicitarXLSXJSReport(json, 'BajasVidaXLSX', $("#usuarioLogeado").html()+'bajas.xls')
            console.log('xlsx'+elementoXLSX)

        },
        error: function (r) {
            console.log('error'+r)
        }
    });
}
function solicitarXLSXJSReport(json, nombreDeLaVistaEnReportingSenter, nombreParaElArchivo) {
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
$("#soliciatarReporteEnExcel").click(function () {
    soliciatarReporteEnExcel(elementoXLSX, 'BajaVidaXLSX')
})// $('#reporteBajas').removeAttr('src')
// $('#reporteBajas').attr('src', 'data:application/pdf;base64,' + res)

},
error: function (r) {
console.log('error'+r)
}
});
}


function createJsonReport(jsonBody){
    let innerOption = document.getElementById("selectorMotivoBaja").options[document.getElementById("selectorMotivoBaja").selectedIndex].text;
    dato = {
        "resultados": {
            "fecha_inicio": $('#fechadesde').val(),
            "fecha_fin": $('#fechahasta').val(),
            "unidad_gg": $('#selectorUnidadGG').val(),
            "motivo_baja": innerOption,
            "empleados": jsonBody
        }
    }
    let vista = 'BajasVida'
    let nombrePDF= 'pdfBajasVida.pdf'
    solicitarPDFJSReport(dato, vista, nombrePDF)
}


function createJsonReportXLSX(jsonBody){
    let innerOption = document.getElementById("selectorMotivoBaja").options[document.getElementById("selectorMotivoBaja").selectedIndex].text;
    dato = {
        "resultados": {
            "fecha_inicio": $('#fechadesde').val(),
            "fecha_fin": $('#fechahasta').val(),
            "unidad_gg": $('#selectorUnidadGG').val(),
            "motivo_baja": innerOption,
            "empleados": jsonBody
        }
    }
    let vista = 'BajasVida'
    let nombreXLS= console.log($("#usuarioLogeado").html())+'LSBajasVida.xlsx'
    solicitarPDFJSReport(dato, vista, nombreXLS)
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

//motivo de baja
option = '';
option += "<option value='' data-select2-id=''>Seleccione...</option>"
option += "<option value='110'>Fin de periodo a prueba (C)</option>"
option += "<option value='38'>Baja con telegrama (C)</option>"
option += "<option value='146'>Renuncia con telegrama (C)</option>"
option += "<option value='37'>Baja efectiva con telegrama (C)</option>"
option += "<option value='109'>Baja sin telegrama (A)</option>"
option += "<option value='147'>Renuncia sin telegrama (A)</option>"
option += "<option value='120'>Baja efectiva sin telegrama (A)</option>"
$('#selectorMotivoBaja').html(option)


