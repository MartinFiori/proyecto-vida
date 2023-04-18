$('.autocomplete').select2({
    theme: 'bootstrap4'
});

$('.inputdatepicker').datepicker({
    format: 'dd-mm-yyyy',
    language: 'es',
    autoclose: true
});

function loginN4(idempresa,usuario,pass) {
    ajax("POST", '/api/login-nitro4', {
        idEmpresa: idempresa,
        usuario: usuario,
        clave: pass
    }, function (respuesta) {
        if (respuesta.estado > 0) {
            sesion.set('token', respuesta.token);
            sesion.set('usuario', respuesta.usuario);
            sesion.set('idUsuario', respuesta.resultados.idUsuario);
            location.href = '/';
        } else {
              Toast.fire({
                  icon: "error",
                  title: respuesta.mensaje
              })
        }
    });
}

function esVacio(val, texto) {
    if (!($('#' + val + '').val() != '' && $('#' + val + '').val() != undefined && $('#' + val + '').val() != 'x' && $('#' + val + '').val() != null)) {
        errores.push(texto + ' ')
        iderrores.push(val)
    }
}

function esVacioSelect(val, texto, valselect) {
    if (!($('#' + val + '').val() != '' && $('#' + val + '').val() != undefined && $('#' + val + '').val() != null)) {
        errores.push(texto + ' ')
        iderrores.push(valselect)
    }
}

function esVacioESPECIAL(val, texto) {
    if (!($('#' + val + '').value != '' && $('#' + val + '').value != undefined)) {
        errores.push(texto + ' ')
        iderrores.push(val)
    }
}

function esVacioSelectESPECIAL(val, texto, valselect) {
    if (!($('#' + val + '').value != '' && $('#' + val + '').value != undefined )) {
        errores.push(texto + ' ')
        iderrores.push(valselect)
    }
}

function campoDateDDMMAAAATabla(date) {
    arrayDate = date
    anio = arrayDate.substr(4, 4);
    mes = arrayDate.substr(2, 2);
    dia = arrayDate.substr(0, 2);
    return dia + '-' + mes + '-' + anio 
}

function campoDateDDMMAAAA(date) {
    arrayDate = date
    anio = arrayDate.substr(4, 4);
    mes = arrayDate.substr(2, 2);
    dia = arrayDate.substr(0, 2);
    return new Date (anio,mes-1,dia) 
}

function fechaNitroADate(date) {
    arrayDate = date
    anio = arrayDate.substr(0, 4)
    mes = arrayDate.substr(5, 2)
    dia = arrayDate.substr(8, 2);
    hora = arrayDate.substr(11, 2);
    minuto = arrayDate.substr(14, 2);
    return new Date (anio,mes-1,dia,hora,minuto) 
}

function fechayHoraNitroAString(date) {
    arrayDate = date
    anio = arrayDate.substr(0, 4)
    mes = arrayDate.substr(5, 2)
    dia = arrayDate.substr(8, 2);
    hora = arrayDate.substr(11,2)
    minutos = arrayDate.substr(14,2)
    return dia + '-' + mes + '-' + anio + ' ' + hora + ':' + minutos
}

function DateToString(date) {
    anio = date.getFullYear()
    mes = dosDecimales(date.getMonth() + 1)
    dia = dosDecimales(date.getDate())
    hora = dosDecimales(date.getHours())
    minutos = dosDecimales(date.getMinutes())
    return dia + '-' + mes + '-' + anio + ' ' +  hora + ':' + minutos
}

function DateToStringSinHoras(date) {
    anio = date.getFullYear()
    mes = dosDecimales(date.getMonth() + 1)
    dia = dosDecimales(date.getDate())
    return dia + '-' + mes + '-' + anio
}

function dosDecimales(val){
    if(val < 10){
        return "0" + val
    }else{
        return "" + val
    }

}

$("#bajas").on('click', function (event) {
    window.location.href = "./../bajas"
})
$("#indumentaria").on('click', function (event) {
    window.location.href = "./../indumentaria"
})
$("#validador").on('click', function (event) {
    window.location.href = "validacion"
})
$("#visualizador_auto").on('click', function (event) {
    window.location.href = "visualizadorAuto"
})

var loadSelect = async function load_Select(valid, valdescripcion, idselect, urlForm, where = '', selectDefault = true) {
    return $.ajax({
        "url": urlForm,
        "type": 'GET',
        "async": false,
        "data": { 'where': where },
        success: function (data) {
            if (data.estado == 1) {
                option = "";
                if (selectDefault) {
                    option += "<option value='' >Seleccione...</option>";
                }
                $.each(data.respuesta, function (index, val) {
                    let value = val[valid] == undefined || val[valid] == '' ? '  ' : val[valid]
                    option += "<option value='" + value + "' >" + value + " - " + val[valdescripcion] + "</option>";
                });
                $("#" + idselect).html(option)
                Loadtrigger()
            }
        },
        error: function (r) {
            var error = JSON.parse(r.responseText).message;
            console.log(error);
        }
    });
}

var loadSelectSoloDescripcion = async function(valid, valdescripcion, idselect, urlForm, where = '', selectDefault = true) {
    return $.ajax({
        "url": urlForm,
        "type": 'GET',
        "async": false,
        "data": where,
        success: function (data) {
            if (data.estado == 1) {
                option = "";
                if (selectDefault) {
                    option += "<option value='' >Seleccione...</option>";
                }
                $.each(data.respuesta, function (index, val) {
                    let value = val[valid] == undefined || val[valid] == '' ? '  ' : val[valid]

                    option += "<option"
                    option += " data-descripcion='" + val[valdescripcion] + "' ";
                    option += " value='" + value + "' >" + val[valdescripcion] + "</option>";
                });
                $("#" + idselect).html(option)
                Loadtrigger()
            }
        },
        error: function (r) {
            var error = JSON.parse(r.responseText).message;
            console.log(error);
        }
    });
}

function loadSelectCategoria(valid, valid2, valdescripcion, idselect, urlForm, where = '', selectDefault = true) {
    $.ajax({
        "url": urlForm,
        "type": 'GET',
        "data": { 'where': where },
        success: function (data) {
            if (data.estado == 1) {
                option = "";
                if (selectDefault) {
                    option += "<option value='' >Seleccione...</option>";
                }
                $.each(data.respuesta, function (index, val) {
                    let value = val[valid] == undefined || val[valid] == '' ? '  ' : val[valid]
                    option += "<option value='" + val[valid2] + "' >" + value + " - " + val[valdescripcion] + "</option>";
                });
                $("#" + idselect).html(option)
                Loadtrigger()
            }
        },
        error: function (r) {
            var error = JSON.parse(r.responseText).message;
            console.log(error);
        }
    });
}

function loadSelectEXP(valid, valdescripcion, idselect, urlForm, where = '', domicilioExport, selectDefault = true) {
    $.ajax({
        "url": urlForm,
        "type": 'GET',
        "data": { 'where': where },
        success: function (data) {
            if (data.estado == 1) {
                option = "";
                if (selectDefault) {
                    option += "<option value='' >Seleccione...</option>";
                }
                // option += "<option value='" + domicilioExport + "' >" + datos.empleador_Actividad + ' - ' + domicilioExport + "</option>";

                $.each(data.respuesta, function (index, val) {
                    option += " <option ";
                    option += " data-domcallenombre='" + val.DomCalleNombre + "' ";
                    option += " data-domcallenro='" + val.DomCalleNro + "' ";
                    option += " data-loccpostal='" + val.LocCPostal + "' ";
                    option += " data-locnombre='" + val.LocNombre + "' ";
                    option += " data-prvnombre='" + val.PrvNombre + "' ";
                    option += " data-piso='" + val.piso + "' ";
                    option += " data-depto='" + val.depto + "' ";
                    option += " data-nodonro_nc='" + val['nodonro_nc'] + "' ";
                    option += " data-DomNro='" + val.DomNro + "' ";
                    option += " value='" + val[valid] + "' >" + val[valdescripcion] + " - (" + val['uoc'] + ")" +"</option>";
                });
                $("#" + idselect).html(option)
                Loadtrigger()
                setTimeout(() => {
                    $("#loader").hide()
                }, 1000)
            }
        },
        error: function (r) {
            var error = JSON.parse(r.responseText).message;
            console.log(error);
        }
    });
}

function traerDatos(urlForm) {
    $.ajax({
        "url": urlForm,
        "type": 'GET',
        "data": { 'where': { "idaltatemp": datos.idReferencia } },
        success: function (data) {
            // console.log(data)
            datos.clienteCuit = data.respuesta[0].clienteCuit
            datos.domnro = data.respuesta[0].domnro
            datos.empresaNumero = data.respuesta[0].empresaNumero
            buscarDatosSelectores()
        },
        error: function (r) {
            var error = JSON.parse(r.responseText).message;
            console.log(error);
        }
    });
}
function consultaReportesAnulaciones(urlForm,unaData) {


    console.log("en consultareportesanulaciones");
    
console.log(urlForm,unaData,'--------+++++---------')
    console.log(URLSERVICIOSNITRO4 + urlForm);
    $.ajax({
        "url": URLSERVICIOSNITRO4 + urlForm,
        "headers": HeaderNitro,
        "type": 'POST',
        "data": unaData,
        success: function (data) {
            let jsonResult=[]
            console.log("en success consultareportesanulaciones"+data);

            for (let index = 0; index < data.resultados.length; index++) {
                const ele = data.resultados[index];
                let unDato = {
                 "cuil" : ele.empleado_Cuil,
                 "fecha_baja" : ele.empleado_FechaFin,
                 "fecha_anulacion" : ele.empleado_FechaFin,
                 "nombreApellido": ele.empleado_NombreApellido,
                 "id_proceso" : ele.idNitro4,
                 "codigo_categoria" :  ele.Razonsocial,
                 "tipo_situacion_baja" :  ele.DescripcionMotivoKtna,
                 "urlDescargaPDF" : 'http://'+window.location.hostname+':9000/anulaciones/'+ele.empleado_Cuil+'.pdf'
                }
                jsonResult.push(unDato)
            }

            headers = [
                'cuil',
                'fecha_baja',
                'id_proceso',
                'codigo_categoria',
                'tipo_situacion_baja',
            ]

            createJsonReportXLSX(jsonResult)
            console.log()
        },
        error: function (r) {
            console.log("en error consultareportesanulaciones", unaData);

            console.log(r);
        }
    });
}

function consultaMinioUploadFile(urlForm,unaData) {
    console.log("en consultaMinioUploadFile"+unaData);
    $.ajax({
        "url": URLSERVICIOSNITRO4 + urlForm,
        "headers": HeaderNitro,
        "type": 'POST',
        "data": unaData,
        success: function (data) {
           
            console.log(data)
        },
        error: function (r) {
            console.log("en error consultareportesanulaciones", unaData);
            console.log(r);
        }
    });
}


function tablaReportesAnulaciones(id, headers, data) {
    data=JSON.parse(data)
    data = data['data']['resultados']['empleados'];
    var table = $("#" + id).DataTable();
    table.destroy();
    columns = [];
    table = $('#' + id).DataTable({
        "searching": true,
        "scrollCollapse": true,
        "language": language,
        "data":data,
        "columns": [
           { title: "CUIL" , data: "cuil"},
           { title: "Fecha baja", data: "fecha_baja" },
           { title: "ID proceso", data: "id_proceso" },
           { title: "Codigo categoria", data: "codigo_categoria" }
        ]
    });
    return true;
}

function loadSelectAFIP(valid, valdescripcion, idselect) {
    $.ajax({
        "url": URLSERVICIOSNITRO4 + 'domicililiosexpafip',
        "headers": HeaderNitro,
        "type": 'GET',
        "data": {
            'calle': datos.empleador_DomCalle,
            'cuitempad': datos.empleador_Cuit,
            'altura': datos.empleador_DomNumero,
            'codigopostal': datos.empleador_DomCP,
            'actividadeconom': $("#empleadorActividad").val()
        },
        success: function (data) {
            if (data.estado == 1) {
                option = "";
                option += "<option value='seleccione' data-ActividadAFIP= 'seleccione' >Seleccione...</option>";
                option += "<option value='' data-ActividadAFIP= '' >Nuevo</option>";
                $.each(data.resultados, function (index, val) {
                    option += " <option value='" + val[valid] + "' data-ActividadAFIP='" + val['Actividad'] + "'>" + val[valdescripcion] + ' - Act. Economica: ' + val['Actividad'] + "</option>";
                });
                $("#" + idselect).html(option)
                setTimeout(() => {
                    $('#domiciolioExplotacionAFIP').val(datos.empleador_SucAfip).trigger('change')
                    $("#loader").hide()
                    $("#domiciolioExplotacionAFIP").change(function (event) {
                        seRegistroActividad()
                        value = $(this).val();
                        if (value != '') {
                            datos.empleador_SucAfip = value
                        }
                    });
                }, 1000)
            }
        },
        error: function (r) {
            var error = JSON.parse(r.responseText).message;
            console.log(error);
        }
    });
}


function cargarJson(idValue, descripcion, idSelector, json) {
    if (json == 'puestoDesempenado') {
        cargarSelectJsonDoble(idValue, descripcion, idSelector, puestoDesempenado)
    }
    if (json == 'ESR') {
        cargarSelectJsonDoble(idValue, descripcion, idSelector, ESR)
    }
    if (json == 'modalidadLiquicion') {
        cargarSelectJsonDoble(idValue, descripcion, idSelector, modalidadLiquicion)
    }
    if (json == 'EMC') {
        cargarSelectJsonDoble(idValue, descripcion, idSelector, EMC)
    }
    if (json == 'EGTS') {
        cargarSelectJsonDoble(idValue, descripcion, idSelector, EGTS)
    }
    if (json == 'ETS') {
        cargarSelectJsonDoble(idValue, descripcion, idSelector, ETS)
    }
}

function cargarSelectJsonDoble(idValue, descripcion, idSelector, json) {
    option = "";
    option += "<option value='' >Seleccione...</option>";
    $.each(json.datos, function (index, val) {
        option += " <option value='" + val[idValue] + "' >" + val['codigo'] + " - " + val[descripcion] + "</option>";
    });
    $("#" + idSelector).html(option)
}

var cargarDatosDelCampo = async function datosCampo(URL,where) {
    return $.ajax({
        url: URL,
        type: 'GET',
        timeout: 1000,
        async: false,
        headers: HeaderNitro,
		data: where,
        success: function (data) {
            return data
        },
        error: function (error) {
            console.log(error);
        }
    });
}