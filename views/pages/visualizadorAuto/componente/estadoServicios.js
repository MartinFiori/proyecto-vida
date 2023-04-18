traerDatosDeServicios()
testearServicios()

var registroSeleccionado
function traerDatosDeServicios(cantidadDeFilas = 5, unfiltrosucursal) {
    // console.log('ACTUALIZANDO TABLA')
    var id = 'transacciones_en_vivo';
    var headers = [
        "Proceso",
        "empleado_NombreApellido",
        "idReferencia",
        "empleado_Sucursal",
        "empleado_Cuil",
        "empleador_Cuit",
        "unaFechaTablaCorta",
        "mapeoEtapa",
        "mapeoEstado",
        "FNDATE",
        "botonRegistro",
        // "botonDatos",
    ];
    cargarTablaVisualizador(id, headers, evento_datatable, cantidadDeFilas, unfiltrosucursal);
}

function evento_datatable(data) {
    console.log(data)
    registroSeleccionado = data
    verModuloProceso(true)
    $("#loader").show()
    datosDelProceso(data.Proceso)
}

function verModuloProceso(val) {
    $('#proceso').attr('hidden', val)
    $("#loader").hide()
}

function varVisualizador(id) {
    window.location.href = "./validacion/" + id
}


function expotarRegistro() {

    setTimeout(async function () {

        for (let index = 0; index < 100; index++) {
            console.log(index)
            var datosParaElInforme = {
                "empleado_NombreApellido": registroSeleccionado.empleado_NombreApellido,
                "empleado_Cuil": registroSeleccionado.empleado_Cuil,
                "empleado_Dni": registroSeleccionado.empleado_Dni,
                "empleado_FechaNac": registroSeleccionado.empleado_FechaNac,

                "empleador_razonsocial": registroSeleccionado.empleador_razonsocial,
                "razonsocial_clienteGG": registroSeleccionado.razonsocial_clienteGG,
                "empleado_FechaInicio": registroSeleccionado.empleado_FechaInicio,
                "empleador_DomCP": registroSeleccionado.empleador_DomCP,
                "empleador_DomCalle": registroSeleccionado.empleador_DomCalle,
                "empleador_DomLocalidad": registroSeleccionado.empleador_DomLocalidad,
                "empleador_DomProvincia": registroSeleccionado.empleador_DomProvincia,
                "empleador_DomNumero": registroSeleccionado.empleador_DomNumero,
                "nodonro_nc": registroSeleccionado.nodonro_nc,

                // "DomNro": registroSeleccionado.DomNro,

                "empleado_PuestoDesemp": registroSeleccionado.empleado_PuestoDesemp,
                "empleado_Sucursal": registroSeleccionado.empleado_Sucursal,
                "empleador_Cuit": registroSeleccionado.empleador_Cuit,
                "ClausulaNoRepeticion": analizarValorCheckParaReporte(registroSeleccionado.ClausulaNoRepeticion),
                "empleado_Lic_COVID": analizarValorCheckParaReporte(registroSeleccionado.empleado_Lic_COVID),
                "empleado_TrabAgropecuario": analizarValorCheckParaReporte(registroSeleccionado.empleado_TrabAgropecuario),
                "empleado_Regimen": analizarValorCheckParaReporte(registroSeleccionado.empleado_Regimen),
                "empleado_Prepaga": analizarValorCheckParaReporte(registroSeleccionado.empleado_prepaga),

                "empleado_ModalidadContrato": buscarDescripcionEnJSON(registroSeleccionado.empleado_ModalidadContrato, 'EMC'),
                "empleado_GrupoTipoServicio": buscarDescripcionEnJSON(registroSeleccionado.empleado_GrupoTipoServicio, 'EGTS'),
                "empleado_ModLiquidacion": buscarDescripcionEnJSON(registroSeleccionado.empleado_ModLiquidacion, 'modalidadLiquicion'),
                "empleado_TipoServicio": buscarDescripcionEnJSON(registroSeleccionado.empleado_TipoServicio, 'ETS'),
                "empleado_Situacion_Revista": buscarDescripcionEnJSON(registroSeleccionado.empleado_Situacion_Revista, 'ESR'),
                "tipoSueldo": buscarDescripcionEnJSON(registroSeleccionado.tipoSueldo, 'TS'),
                "empleado_PuestoDesemp": registroSeleccionado.empleado_PuestoDesemp,
                "empleado_Categoria": registroSeleccionado.empleado_Categoria,

                "idReferencia": registroSeleccionado.idReferencia,
                "empleado_RetribucionPactada": '$' + registroSeleccionado.empleado_RetribucionPactada,
                "empleado_Convenio": registroSeleccionado.empleado_Convenio,
                "empleado_ConvenioNumero": registroSeleccionado.empleado_ConvenioNumero,
                "cuit_clienteGG": registroSeleccionado.cuit_clienteGG,
            }

            console.log("1")
            await cargaDeDatosDeRelaciones(datosParaElInforme)
            console.log("5")
            console.log(datosParaElInforme)

        }

    }, 500)

}

async function cargaDeDatosDeRelaciones(datosParaElInforme) {
    try {
        res = await cargarDatosDelEmpleador(registroSeleccionado.empleador_Cuit)
        datosParaElInforme.empleador_razonsocial = res.resultados.Razonsocial
        // ACTIVIDAD
        res = await cargarDatosDelCampo(URLSERVICIOSVPN + 'Actividad', { "ActAfipCodigo": registroSeleccionado.empleador_Actividad })
        datosParaElInforme.empleador_Actividad = res.respuesta[0].ActAfipCodigo + " - " + res.respuesta[0].ActAfipNombre

        // OBRA SOCIAL
        res = await cargarDatosDelCampo(URLSERVICIOSVPN + 'ObraSocial', { "OSocCodigo": registroSeleccionado.empleado_ObraSocial })
        datosParaElInforme.empleado_ObraSocial = res.respuesta[0].OSocCodigo + " - " + res.respuesta[0].OSocSigla + " - " + res.respuesta[0].OSocNombre

        // calificacionProfesional
        res = await cargarDatosDelCampo(URLSERVICIOSVPN + 'calificacionProfesional', { "CProNro": registroSeleccionado.calificacionProfesional })
        datosParaElInforme.calificacionProfesional = res.respuesta[0].CProNom + ""

        console.log(datosParaElInforme)
    } catch (err) {
        console.log(err)
    }
}

function analizarValorCheckParaReporte(params) {
    if (params == '1' || params == 1) {
        return 'SI'
    } else {
        return 'NO'
    }
}

function buscarDescripcionEnJSON(codigo, json) {
    if (json == 'puestoDesempenado') {
        return buscarCodigoEnJson(codigo, puestoDesempenado)
    }
    if (json == 'ESR') {
        return buscarCodigoEnJson(codigo, ESR)
    }
    if (json == 'modalidadLiquicion') {
        return buscarCodigoEnJson(codigo, modalidadLiquicion)
    }
    if (json == 'EMC') {
        return buscarCodigoEnJson(codigo, EMC)
    }
    if (json == 'EGTS') {
        return buscarCodigoEnJson(codigo, EGTS)
    }
    if (json == 'ETS') {
        return buscarCodigoEnJson(codigo, ETS)
    }
    if (json == 'TS') {
        return buscarCodigoEnJson(codigo, TS)
    }
}

function buscarCodigoEnJson(codigo, json) {
    var resultadoFiltro = json.datos.filter(datoDelJson => datoDelJson.codigo == codigo)
    return resultadoFiltro[0].descripcion
}

function testearServicios() {
    setearFechaEnElTitulo()
    cambioDeEstadoDeLosBotonesDeLosServicios('VALIDANDO_AFIP', 'btnEstadoAFIP')
    cambioDeEstadoDeLosBotonesDeLosServicios('AFIP_ALTA_TEMPRANA', 'btnEstadoAltaTemprana')
    cambioDeEstadoDeLosBotonesDeLosServicios('CVI_KTNA', 'btnEstadoCVIKTNA')
}

function setearFechaEnElTitulo() {
    var fecha = DateToStringSinHoras((new Date))
    $("#hora_sin_error").append(fecha)
    $("#hora_con_error").append(fecha)
    $("#hora_top").append(fecha)
}

function cambioDeEstadoDeLosBotonesDeLosServicios(val, idBoton) {
    consultaDeFuncionamientoDeServicio(val, function (resultado) {
        if (resultado) {
            document.getElementById("" + idBoton).className = "btn btn-lg btn-block btn-success"
        } else {
            document.getElementById("" + idBoton).className = "btn btn-lg btn-block btn-danger"
        }
    })
}

function consultaDeFuncionamientoDeServicio(val, func) {
    if (val == 'VALIDANDO_AFIP') {
        testear_AFIP('estadoPadron', function (resultado) {
            colorDeBotones(resultado, "btnEstadoAFIP")
        })

    }
    if (val == 'AFIP_ALTA_TEMPRANA') {
        testear_AFIP('estadoAfip', function (resultado) {
            colorDeBotones(resultado, "btnEstadoAltaTemprana")
        })
    }
    if (val == 'CVI_KTNA') {
        testear_CVI_KTNA(func)
    }
}
function colorDeBotones(resultado, boton) {
    if (resultado == 0) {
        document.getElementById(boton).className = "btn btn-lg text-white btn-block btn-success"
    }
    if (resultado == 2 || resultado == 1) {
        document.getElementById(boton).className = "btn btn-lg btn-block  text-white btn-warning"
    }
    if (resultado > 2) {
        document.getElementById(boton).className = "btn btn-lg text-white btn-block btn-danger"
    }
}

function mapearEstado(estado) {
    switch (estado) {
        case 4:
            return 'No procesado'
            break;
        case 5:
            return 'En Proceso'
            break;
        case 6:
            return 'Proceso Finalizado'
            break;
        case 7:
            return 'Proceso Finalizado con Errores'
            break;
        case 8:
            return 'Datos a Verificar'
            break;
        default:
            return ''
            break;
    }
}

function mapearEtapa(etapa) {
    switch (etapa) {
        case 1:
            return 'Recibido'
            break;
        case 2:
            return 'Verificacion Padron'
            break;
        case 3:
            return 'Scraping Afip'
            break;
        case 4:
            return 'Generacion Reportes'
            break;
        case 5:
            return 'Mailing'
            break;
        case 6:
            return 'Error'
            break;
        case 7:
            return 'Creacion de legajo KTNA'
            break;
        default:
            return ''
            break;
    }
}