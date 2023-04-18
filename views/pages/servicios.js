var NOMBRE
var usuarioLogueado
var abrirModal = true
$("#usuarioLogeado").append(sesion.get('usuarioLogueado'))
function cargarTabla(id, headers, funcion, columnDef, unfultrosucursal = '', unselectorUnidadGG = '', unSelectorEstado = '', unafechaIngreso = '', unafecha = '', unfiltrocliente = '') {
    $("#loader2").show()
    $("#soliciatarReporteEnExcel").remove()
    var table = $("#" + id).DataTable();
    table.destroy();
    columns = [];
    headers.forEach(function (element) {
        columns.push({ data: element });
    });
    table = $('#' + id).DataTable({
        "searching": true,
        "scrollCollapse": true,
        "scrollY": '780px',
        "scrollX": true,
        "language": language,
        "ajax": {
            "url": URLSERVICIOSNITRO4 + 'consultaverificacion',
            "type": "GET",
            "headers": HeaderNitro,
            "contentType": 'application/json',
            "timeout": 0,
            "dataSrc": function (json) {
                var filtrados = json.resultados
                var empresas = []
                if (unfultrosucursal != '') {
                    filtrados = filtrados.filter(alta =>
                        alta.empleado_Sucursal.toUpperCase().includes(unfultrosucursal.toUpperCase()) ||
                        alta.empleado_Sucursal == '')
                }

                if (unfiltrocliente != '') {
                    filtrados = filtrados.filter(alta =>
                        alta.razonsocial_clienteGG.toUpperCase().includes(unfiltrocliente.toUpperCase()) ||
                        alta.razonsocial_clienteGG == '')
                }

                if (unselectorUnidadGG != '') {
                    filtrados = filtrados.filter(alta => alta.empleador_razonsocial == unselectorUnidadGG)
                }
                if (unSelectorEstado == 'Errores') {
                    filtrados = filtrados.filter(alta => alta.Error != null)
                }
                if (unSelectorEstado == 'Para validar') {
                    filtrados = filtrados.filter(alta => alta.Error == null)
                }
                filtrados.forEach(element => {
                    if(element.empleador_SucAfip == null || element.empleador_SucAfip == undefined){
                        element.empleador_SucAfip = ''
                    }

                    var FechaInicio = element.empleado_FechaInicio.replace("-", "").replace("-", "")
                    FechaInicio = FechaInicio.replace("/", "").replace("/", "")

                    var FINICIOSTRING = campoDateDDMMAAAATabla(FechaInicio)
                    element.FINICIODATE = campoDateDDMMAAAA(FechaInicio);

                    var FNDATE = fechaNitroADate(element.fechaModificacionNitro4)
                    element.FNDATE = FNDATE;

                    element.unaFechaTabla = FINICIOSTRING
                    element.fechaModificacionmostrar = DateToString(element.FNDATE)

                    if (element.Error == null) {
                        element.ErrorTabla = '<p style ="color:orange; max-width: 300px !important;">Para validar</p> '
                    } else {
                        element.ErrorTabla = '<p style ="color:red; max-width: 300px !important;">' + element.Error.replaceAll(":", ": ").replaceAll("\",\"", "\" , \"") + '</p> '
                    }
                    if (element.ComentariosAlta == null) {
                        element.ComentariosAlta = ''
                    }

                    element.botonEliminarRegistro = ''
                    element.botonEliminarRegistro += '<button type="button" onclick="recincronizarRegistro(' + element.Proceso + ')" class="btn btn-info btn-sm" style="width: 45px;margin: 5px;"><-></button>'
                    
                    if(mailsAutorizados.includes(sesion.get('usuarioLogueado'))){
                        element.botonEliminarRegistro += '<br><button type="button" onclick="eliminarRegistro(' + element.Proceso + ')" class="btn btn-danger btn-sm" style="width: 45px;margin: 5px;">X</button>'
                    }

                    // CARGAR SELECT POR EMPRESA
                    empresas.push(element.empleador_razonsocial)

                });

                if (unafecha != '' && unafecha != null) {
                    filtrados = filtrados.filter(alta => alta.fechaModificacionmostrar.substr(0, 10) == unafecha)
                }

                if (unafechaIngreso != '' && unafechaIngreso != null) {
                    filtrados = filtrados.filter(alta => alta.unaFechaTabla == unafechaIngreso)
                }

                if (filtrados.length > 0) {
                    botonExportar = ''
                    var datos = {};
                    datos = filtrados;
                    botonExportar += '<button type="button" id="soliciatarReporteEnExcel" class="btn btn-dark ml-2">Exportar Datos <i class="fa fa-download "></i></button>';

                    $("#botonExportar").append(botonExportar); //add input box  
                    $("#soliciatarReporteEnExcel").click(function () {
                        soliciatarReporteEnExcel(datos, 'ADPBOT')
                    })
                }

                var setEmpresas = [...new Set(empresas)];
                if (unfultrosucursal == '' && unselectorUnidadGG == '') {
                    option = "";
                    option += "<option value='' >Seleccione...</option>";
                    $.each(setEmpresas, function (index, val) {
                        option += "<option value='" + val + "' >" + val + "</option>";
                    });
                    $("#selectorUnidadGG").html(option)
                }
                $("#loader2").hide()
                return filtrados;
            },

        },
        "columnDefs": columnDef,
        "pageLength": 12,
        "columns": columns,
        dom: 'Bfrtip',
        buttons: [
            'excelHtml5',
        ]
    });
    table.order([9, 'desc']).draw();
    var orden = 0
    $("#ordenarPorFecha").on('click', function (event) {
        if (orden == 0) {
            orden = 1
            table.order([9, 'asc']).draw();
        } else {
            orden = 0
            table.order([9, 'desc']).draw();
        }
    })
    var orden2 = 0
    $("#ordenarPorFechaIngreso").on('click', function (event) {
        if (orden2 == 0) {
            orden2 = 1
            table.order([10, 'asc']).draw();
        } else {
            orden2 = 0
            table.order([10, 'desc']).draw();
        }
    })
    $('#' + id + ' tbody').unbind('click');
    $('#' + id + ' tbody').on('click', 'tr', function () {
        var data = table.row(this).data();
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            if (funcion) {
                funcion(data);
            }
        }
    });
    if (NOMBRE != '') {
        table.search(NOMBRE).draw();
        NOMBRE = ''
    }
    return true;
}


function soliciatarReporteEnExcel(datas, nombreDeLaVistaEnReportingSenter) {
    $("#soliciatarReporteEnExcel").css("pointer-events", "none")
    var rutaRS = rutaReportingSenter
    let jsondata = JSON.stringify({
        name: nombreDeLaVistaEnReportingSenter,
        type: "xlsx",
        data: { resultados: datas }
    })
    $.ajax({
        "url": rutaRS,
        "headers": { "Content-Type": "application/json" },
        "type": 'POST',
        "data": jsondata,
        beforeSend: function () {
            $("#loader2").show()
        },
        success: function (res) {
            $("#loader2").hide()
            $("#soliciatarReporteEnExcel").css("pointer-events", "auto")
            if (res.error != true) {
                var link = document.createElement("a");
                link.href = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + encodeURIComponent(res);
                link.style = "visibility:hidden";
                link.download = nombreDeLaVistaEnReportingSenter + DateToString(new Date());
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                console.log(error);
            }
        },
        error: function (r) {
            $("#loader2").hide()
            $("#soliciatarReporteEnExcel").css("pointer-events", "auto")
            var Msjerror = JSON.parse(r.responseText).message;
            console.log(Msjerror);
        }
    });
}

var etapasFinales = [];

function datosDelProceso(idProceso) {
    $.ajax({
        "url": URLSERVICIOSNITRO4 + 'logsconsultaxproceso',
        "headers": HeaderNitro,
        "type": 'get',
        "data": { "proceso": idProceso },
        success: function (data) {
            var registrosDelProceso = data.resultados
            var etapas = ['', 'Validacion AFIP', 'ScrapingSync', 'ReportMaker', '', 'MailCenter','', 'Creacion de legajo KTNA']
            etapasFinales = [];
            for (let i = 0; i < etapas.length; i++) {
                if (etapas[i] != '') {
                    armarObjetoEtapas(registrosDelProceso, i, etapas[i])
                }
            }
            mostrarDatosDeProcesos()
        },
        error: function (error) {
            alert(error);
        }
    });
}

var ultimoRegistro = {}
ultimoRegistro.Mensaje = ''
function armarObjetoEtapas(registrosDelProceso, numeroDeEtapa, nombreDeLaEtapa) {
    datosDeEtapa = {
        "numeroDeEtapa": numeroDeEtapa,
        "nombreDeLaEtapa": nombreDeLaEtapa
    }
    if (registrosDelProceso.length != 0) {
        var registrosDeEtapa = registrosDelProceso.filter(registro => registro.Etapa == numeroDeEtapa)
        if (registrosDeEtapa.length != 0) {

            ultimoRegistro = registrosDeEtapa[registrosDeEtapa.length - 1]
            datosDeEtapa.cantidadDeIntentos = registrosDeEtapa.length - 1
            datosDeEtapa.ultimoResultadoDeEtapa = ultimoRegistro.Mensaje
            datosDeEtapa.FechaDeLaEtapa = fechayHoraNitroAString(ultimoRegistro.fechaModificacionNitro4)
        } else {
            datosDeEtapa.cantidadDeIntentos = '-'
            datosDeEtapa.ultimoResultadoDeEtapa = ultimoRegistro.Mensaje.includes('Fallo') ? '-' : 'En Cola'
            datosDeEtapa.FechaDeLaEtapa = '-'
        }
    } else {
        datosDeEtapa.cantidadDeIntentos = '-'
        datosDeEtapa.ultimoResultadoDeEtapa = '-'
        datosDeEtapa.FechaDeLaEtapa = 'No se registran Datos'
    }
    etapasFinales.push(datosDeEtapa)
}

function mostrarDatosDeProcesos() {
    verModuloProceso(false)
    headers = [
        "numeroDeEtapa",
        "nombreDeLaEtapa",
        "FechaDeLaEtapa",
        "ultimoResultadoDeEtapa",
        "cantidadDeIntentos"
    ]
    var table = $("#etapasDelProceso").DataTable();
    table.destroy();
    columns = [];
    headers.forEach(function (element) {
        columns.push({ data: element });
    });
    table = $('#etapasDelProceso').DataTable({
        "paging": false,
        "searching": false,
        "pageLength": etapasFinales.length,
        "language": language,
        "info": false,
        "data": etapasFinales,
        "columns": columns,
        "columnDefs": [{ "visible": false, targets: 0 }, { width: '20px', targets: 4 },],
        dom: 'Bfrtip',
        buttons: [
            'excelHtml5',
        ]
    });
    table.order([0, 'asc']).draw();
    return true;
}

function mostrarDatosDeProcesosSinRegistros() {
    verModuloProceso(false)
    ObjetoDeError = [{
        "numeroDeEtapa": 'No se Registran Datos',
        "nombreDeLaEtapa": 'No se Registran Datos',
        "FechaDeLaEtapa": 'No se Registran Datos',
        "ultimoResultadoDeEtapa": 'No se Registran Datos',
        "cantidadDeIntentos": 'No se Registran Datos'
    }]
    headers = [
        "numeroDeEtapa",
        "nombreDeLaEtapa",
        "FechaDeLaEtapa",
        "ultimoResultadoDeEtapa",
        "cantidadDeIntentos"
    ]
    var table = $("#etapasDelProceso").DataTable();
    table.destroy();
    columns = [];
    headers.forEach(function (element) {
        columns.push({ data: element });
    });
    table = $('#etapasDelProceso').DataTable({
        "paging": false,
        "searching": false,
        "pageLength": etapasFinales.length,
        "language": language,
        "info": false,
        "data": ObjetoDeError,
        "columns": columns,
        "columnDefs": [{ "visible": false, targets: 0 }, { width: '20px', targets: 4 },],
        dom: 'Bfrtip',
        buttons: [
            'excelHtml5',
        ]
    });

    table.order([0, 'asc']).draw();
    return true;
}

function cargarTablaVisualizador(id, headers, funcion = {}, cantidadDeFilas, unfiltrosucursal = '') {
    let listaSucursales = []
    $("#loader2").show()
    var table = $("#" + id).DataTable();
    table.destroy();
    columns = [];
    headers.forEach(function (element) {
        columns.push({ data: element });
    });
    table = $('#' + id).DataTable({
        "columnDefs": [
            { "width": "80px", "targets": 0 },
            { "width": "135px", "targets": 1 },
            { "width": "135px", "targets": 2 },
            { "width": "135px", "targets": 3 },
            { "width": "135px", "targets": 4 },
            { "width": "135px", "targets": 5 },
            { "width": "135px", "targets": 6 },
            { "width": "135px", "targets": 7 },
            { "width": "135px", "targets": 8 },
            { "visible": false, targets: 9 }
            // { "visible": false, targets: 9 },
            // { "width": "135px", "targets": 10 },
        ],
        "fixedColumns": true,
        "searching": true,
        "scrollCollapse": true,
        "autoWidth": true,
        "language": language,
        "ajax": {
            "url": URLSERVICIOSNITRO4 + 'listadoDedatosAProcesar',
            "type": "get",
            "headers": HeaderNitro,
            "contentType": 'application/json',
            "timeout": 0,
            "dataSrc": function (json) {
                var datos = json.resultados

                cantidadDeAltas24Horas(datos)
                cantidadDeErrores24Horas(datos)
                var filtrados = datos.filter(dom => dom.Etapa > 0 && dom.Etapa <= 7
                    // && fechaNitroADate(dom.fechaModificacionNitro4) >= (new Date).setDate((new Date).getDate() - 7)
                )
                if (unfiltrosucursal != '') {
                    filtrados = filtrados.filter(alta =>
                        alta.empleado_Sucursal.toUpperCase().includes(unfiltrosucursal.toUpperCase()) ||
                        alta.empleado_Sucursal == '')
                }

                filtrados.forEach(element => {
                    element.unaFechaTablaCorta = fechayHoraNitroAString(element.fechaModificacionNitro4)

                    element.unaFechaTabla = element.fechaModificacionNitro4.slice(0, 16)

                    var FNDATE = fechaNitroADate(element.fechaModificacionNitro4)
                    element.FNDATE = FNDATE;

                    if (element.Etapa == 5 && element.Estado == 4) {
                        element.EtapaTabla = 5
                        element.EstadoTabla = 6

                    } else {
                        element.EtapaTabla = element.Etapa
                        element.EstadoTabla = element.Estado
                    }

                    if (element.EtapaTabla == 6) {
                        element.mapeoEtapa = mapearEtapa(element.EtapaTabla)
                        element.mapeoEstado = mapearEstado(7)
                    } else {
                        element.mapeoEtapa = mapearEtapa(element.EtapaTabla)
                        element.mapeoEstado = mapearEstado(element.EstadoTabla)
                    }
                    if (element.mapeoEtapa == 'Error') {
                        element.botonRegistro = '<button type="button" onclick="varVisualizador(\'' + element.empleado_Cuil + '\')" class="btn btn-primary btn-sm">Ver</button>'
                        // element.botonRegistro = '<button type="button" onclick="varVisualizador(\'' + element.empleado_Cuil + '\')" class="btn btn-primary btn-sm">ir</button>'
                    } else {
                        element.botonRegistro = ''
                    }
                        // element.botonDatos = '<button type="button" onclick="expotarRegistro(\'' + element.idNitro4 + '\',' + element.Proceso + ')" class="btn btn-primary btn-sm">Ver</button>'
                    listaSucursales.push(element.empleado_Sucursal)
                });
                filtroDeCantidadDeFilas(cantidadDeFilas, unfiltrosucursal)
                filtroDeSucursales(cantidadDeFilas, unfiltrosucursal, listaSucursales)
                $("#loader2").hide()
                return filtrados;
            },
        },
        "pageLength": cantidadDeFilas,
        "columns": columns,
        "dom": 'Bfrtip',
        buttons: [
            'excelHtml5',
        ]
    });
    table.order([9, 'desc']).draw();
    var orden = 0
    $("#ordenarPorFecha").on('click', function (event) {
        if (orden == 0) {
            orden = 1
            table.order([9, 'asc']).draw();
        } else {
            orden = 0
            table.order([9, 'desc']).draw();
        }
    })
    $('#' + id + ' tbody').unbind('click');
    $('#' + id + ' tbody').on('click', 'tr', function () {
        var data = table.row(this).data();
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            if (funcion) {
                funcion(data);
            }
        }
    });

    $("#loader").hide()
    return true;
}

function filtroDeCantidadDeFilas(cantidadDeFilas, unfiltrosucursal) {
    var htmlFila = ''
    htmlFila += '<label class="ml-2" style="width: 165px;">Cantidad de filas:'
    htmlFila += '<select id="cantidadDeFilas"class="form-control form-control-sm"'
    htmlFila += 'placeholder="" aria-controls="transacciones_en_vivo">'
    // htmlFila += '<option value="' + cantidadDeFilas + '">Seleccione...</option>'
    htmlFila += '<option value="5">5</option>'
    htmlFila += '<option value="10">10</option>'
    htmlFila += '<option value="20">20</option>'
    htmlFila += '<option value="50">50</option>'
    htmlFila += '<option value="100">100</option>'
    htmlFila += ' </select></label>'

    $('#transacciones_en_vivo_filter').append(htmlFila);
    $("#cantidadDeFilas").change(function (event) {
        // console.log($(this).val())
        cantidadDeFilas = $(this).val();
        traerDatosDeServicios(cantidadDeFilas, unfiltrosucursal)
    });
}

/**
 * Visualiza el filtro de sucursales
 * @param { Number } cantidadDeFilas 
 * @param { String } unfiltrosucursal 
 * @param { Object} listaSucursales 
 */
function filtroDeSucursales(cantidadDeFilas, unfiltrosucursal, listaSucursales) {
    var setSucursales = [...new Set(listaSucursales)];

    var htmlFiltroSucursal = ''
    htmlFiltroSucursal += '<label class="ml-2" style="width: 165px;">Filtro sucursal:'
    htmlFiltroSucursal += '<select id="selectorSucursales"class="form-control form-control-sm"'
    htmlFiltroSucursal += 'placeholder="" aria-controls="transacciones_en_vivo">'
    htmlFiltroSucursal += '<option value="' + unfiltrosucursal + '">Seleccione...</option>'
    htmlFiltroSucursal += '<option value="">Todos...</option>'
    $.each(setSucursales, function (index, val) {
        htmlFiltroSucursal += "<option value='" + val + "' >" + val + "</option>";
    });
    htmlFiltroSucursal += ' </select></label>'
    $('#transacciones_en_vivo_filter').append(htmlFiltroSucursal);

    $("#selectorSucursales").change(function (event) {
        // console.log($(this).val())
        unfiltrosucursal = $(this).val();
        traerDatosDeServicios(cantidadDeFilas, unfiltrosucursal)
    });
}

function cantidadDeAltas24Horas(datos) {
    var cantidad = datos.filter(dom => dom.Etapa == 7 && dom.Estado == 6)
    $('#aceptados_altas').html('' + cantidad.length)
    var cantidad = cantidad.filter(dom => fechaNitroADate(dom.fechaModificacionNitro4).getDate() == (new Date).getDate())
    $('#aceptados_altas_hoy').html(' Procesados con ALTA generadas : ' + cantidad.length)
}

function cantidadDeErrores24Horas(datos) {
    var datosHoy = datos
    datosHoy = datosHoy.filter(dom => fechaNitroADate(dom.fechaModificacionNitro4).getDate() == (new Date).getDate())
    datosHoy = datosHoy.filter(dom => dom.mensajeError != null)
    procesadosConErrores(datosHoy)
    procesadosConAltaVigente(datosHoy)
    procesadosConInconsistenciaAFIP(datosHoy)
    topAltasPorSucursal(datosHoy)
}
// Fallo Validacion Afip.

function procesadosConErrores(datosHoy) {
    var total = datosHoy.filter(dom => !(dom.mensajeError.includes('Fallo Validacion Alta Temprana. Error: CUIL ya tiene un alta activa.'))
        && !(dom.mensajeError.includes('Fallo Validacion Afip.')) && dom.mensajeError != null)
    // $('#procesos_con_errores').html('Procesos con errores : ' + total.length)
    $('#procesos_con_errores').html('Altas no procesadas: ' + 0 + ' - Proximamente...')
}
function procesadosConAltaVigente(datosHoy) {
    var total = datosHoy.filter(dom => dom.mensajeError.includes('Fallo Validacion Alta Temprana. Error: CUIL ya tiene un alta activa.'))
    $('#procesados_con_alta_vigente').html('No procesados, tiene un alta activa: ' + total.length)
}
function procesadosConInconsistenciaAFIP(datosHoy) {
    var total = datosHoy.filter(dom => dom.mensajeError.includes('Fallo Validacion Afip.'))
    $('#procesados_con_inconsistencia_cuil').html('No procesados por validacion en padron de Afip: ' + total.length)
}

function topAltasPorSucursal(datosHoy) {
    var listaDeSucursales = datosHoy.map(suc => suc.empleado_Sucursal)
    listaDeSucursales = [...new Set(listaDeSucursales)]

    var obj = []

    for (let index = 0; index < listaDeSucursales.length; index++) {
        var cantidad = datosHoy.filter(dat => dat.empleado_Sucursal == listaDeSucursales[index]).length
        var nombre = listaDeSucursales[index]
        obj.push({ nom: nombre, cant: cantidad, dospuntos: ': ' })
    }
    obj.sort((a, b) => b.cant - a.cant)
    obj.push({ nom: '', cant: '' , dospuntos: '&nbsp;' })
    obj.push({ nom: '', cant: '' , dospuntos: '&nbsp;' })
    obj.push({ nom: '', cant: '' , dospuntos: '&nbsp;' })

    $('#sucursal_1').html('' + obj[0].nom + obj[0].dospuntos + obj[0].cant)
    $('#sucursal_2').html('' + obj[1].nom + obj[1].dospuntos + obj[1].cant)
    $('#sucursal_3').html('' + obj[2].nom + obj[2].dospuntos + obj[2].cant)

}

function ejecutarActualizacion(data,URL,TIPO,funcion) {
    $.ajax({
        "url": '/servicios/api/' + URL,
        "headers": HeaderNitro,
        "type": TIPO,
        "data": data,
        "contentType": 'application/json',
        success: function (respuesta) {
            if (funcion) {
                funcion(respuesta);
            }
        },
        error: function (error) {
            alert(error);
        },
        complete: function () {
        }
    });
}

function descargar(res) {
        var link = document.createElement("a");
        link.href = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + encodeURIComponent(res);
        link.style = "visibility:hidden";
        link.download = datos.empleado_Cuil + '-AcuseIndumentaria.pdf'
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
}

function ejecutarActualizacionDatos(data,generaAcuse){
    ejecutarActualizacion(data,'datosprocesar/' + $('#idNitro4').val() ,'PUT')
    if(generaAcuse){
        ejecutarActualizacion(data,'acuseindumentariacustomAltaDeRopa','POST',descargar)
    }
    setEstadoDelProceso(4,1,$('#Proceso').val())
}


function eliminarRegistro(proceso) {
    abrirModal = false
    setTimeout(()=>{
        abrirModal = true
    },500)
    bootbox.confirm({
        message: "<h3 class='text-center'>¿ Estás seguro de eliminar el Registro ?</h3>",
        buttons: {
            confirm: {
                label: 'SI',
                className: 'btn-success'
            },
            cancel: {
                label: 'NO',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if (result == true) {
                setEstadoDelProceso(1,22,proceso)

            };
        }
    });
}

function recincronizarRegistro(proceso){
    setEstadoDelProceso(1,23,proceso)
}

function setEstadoDelProceso(estado,Etapa,proceso) {
    $.ajax({
        "url": URLSERVICIOSNITRO4 + 'procesos/' + proceso,
        "headers": HeaderNitro,
        "type": 'put',
        "data": { "Estado": estado, "Etapa": Etapa , "origenNombre" : sesion.get('usuarioLogueado')},
        // "data": { "Estado": 8, "Etapa": 0 , "origenNombre" : sesion.get('usuarioLogueado')},
        success: function (data) {
            traerDatosDeNitro4()
        },
        error: function (error) {
            alert(error);
        }
    });
}

function login(user, pass) {
    var xmlhttp = new XMLHttpRequest();
    var token = 'wXuEOWgLFWz/Om2tU/VCvL1XXNRTC/1MSF5L2p2KabA=';
    xmlhttp.open('POST', 'http://plataforma60.axton.com.ar/LGAxton/LoginUsersServices.asmx?WSDL', true);
    var elXML = ''
    elXML += '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempuri.org/">'
    elXML += '<soap:Header/>'
    elXML += '<soap:Body>'
    elXML += '<tem:Valida>'
    elXML += '<tem:usr>' + user + '</tem:usr>'
    elXML += '<tem:pass>' + pass + '</tem:pass>'
    elXML += '<tem:token>' + token + '</tem:token>'
    elXML += '</tem:Valida>'
    elXML += '</soap:Body>'
    elXML += '</soap:Envelope>'

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                var xml = xmlhttp.responseText
                parser = new DOMParser();
                xmlDoc = parser.parseFromString(xml, "text/xml");
                Json = JSON.parse(xmlDoc.getElementsByTagName("ValidaResult")[0].childNodes[0].nodeValue)
                if (Json.estado == 1) {
                    // sesion.set('pernro', Json.estado);
                    sesion.set('usuarioLogueado', user);
                    setTimeout(()=>{
                        analisisDeredireccionamientoSegunCaracteristicasDeUsuario()
                    },1000)
                } else {
                    alert('usuario y/o pass incorrecto');
                }
            }
        }
    }
    xmlhttp.setRequestHeader('Content-Type', 'text/xml;  charset=UTF-8');
    xmlhttp.send(elXML);
}

async function analisisDeredireccionamientoSegunCaracteristicasDeUsuario() {
    
    var existe = await getUsuario()

    if (existe.resultados) {
        if (existe.resultados.vencida) {
            window.location.href = "./cargaDeUsuarioAFIP/"
        }else{
            window.location.href = "./validacion/"
        }
    }else{
        window.location.href = "./validacion/"
    }
    
}

var getUsuario = async function () {
    return await ejecutarAjax('usuariosafip_filtrar', 'POST', { nombre: sesion.get('usuarioLogueado'), filtroNitro4: true })
}

var ejecutarAjax = async function (url, tipo, data = {}) {
    HeaderNitro.Token =  sesion.get('token')
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

function testear_AFIP(url, func) {
    $.ajax({
        "url": URLSERVICIOSNITRO4 + url,
        "headers": HeaderNitro,
        "type": 'get',
        "timeout": 1000,
        success: function (json) {
            if (json.estado == 1) {
                if (json.resultados[0] != undefined) {
                    let valor = json.resultados[0].reintentos
                    func(valor)
                }
            }
        },
        error: function (error) {
            func(3)
        }
    });
}

function testear_CVI_KTNA(func) {
    func(false)
}

var usando = []
async function seEstaUsando(unDato, idReferencia, validarUso) {
    $.ajax({
        url: URLSERVICIOSNITRO4 + 'seEstaUsando',
        type: 'POST',
        headers: HeaderNitro,
        data: {
            idReferencia: idReferencia
        },
        success: function (resultados) {
            validarUso(unDato, !resultados.respuesta)
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function setEnUso(idReferencia) {
    $.ajax({
        url: URLSERVICIOSNITRO4 + 'setEnUso',
        type: 'post',
        timeout: 1000,
        headers: HeaderNitro,
        data: {
            idReferencia: idReferencia,
            fecha: new Date
        },
        success: function (data) {
            return data.respuesta
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function setSeDejoDeUsar(idReferencia) {
    $.ajax({
        url: URLSERVICIOSNITRO4 + 'setSeDejoDeUsar',
        type: 'post',
        timeout: 1000,
        headers: HeaderNitro,
        data: {
            idReferencia: idReferencia
        },
        success: function (data) {
            return data.respuesta
        },
        error: function (error) {
            console.log(error);
        }
    });

}

function buscar_coincidencia_en_relacionador() {
    $.ajax({
        url: URLSERVICIOSNITRO4 + 'buscar_coincidencia_en_relacionador',
        type: 'post',
        timeout: 1000,
        headers: HeaderNitro,
        data: {
            emp_adm: 2,
            cliente_cuit: '20-25486487-9',
            id_domicilio_explotacion_ktna: ' is null'
        },
        success: function (data) {
            console.log(data.resultados)
            return data.resultados
        },
        error: function (error) {
            console.log(error);
        }
    });
}

var loadSelectNitro4 = async function load_Select_Nitro4(valid,valdescripcion1, valdescripcion2, idselect, urlForm, where = '', selectDefault = true) {
    return $.ajax({
        "url": urlForm,
        "type": 'GET',
        "async": false,
        "headers": HeaderNitro,
        "data": { 'where': where },
        success: function (data) {
            if (data.estado == 1) {
                option = "";
                if (selectDefault) {
                    option += "<option value='' >Seleccione...</option>";
                }
                $.each(data.resultados, function (index, val) {
                    // let value = val[valid] == undefined || val[valid] == '' ? '  ' : val[valid]
                    option += "<option value='" + val[valid] + "' >" + val[valdescripcion1] + " - " + val[valdescripcion2] + "</option>";
                });
                $("#" + idselect).html(option)
            }
        },
        error: function (r) {
            var error = JSON.parse(r.responseText).message;
            console.log(error);
        }
    });
}


var cargarDatosDelEmpleador = async function datosEmpleador(empleador_Cuit) {
    return $.ajax({
        url: URLSERVICIOSNITRO4 + 'empresasadministradas_filtrar',
        type: 'post',
        timeout: 1000,
        async: false,
        headers: HeaderNitro,
		data: {
			Cuit: empleador_Cuit,
			filtroNitro4: true
		},
        success: function (data) {
            return data.resultados
        },
        error: function (error) {
            console.log(error);
        }
    });
}

