var datos = {}
var semaforo = 0
var semaforo2 = 0
var semaforoInterval = 0
var semaforoTabla = 1
var prueba = false
var limpiando = false
var tamanoDeLetras = 11
var bloqueoDeModal
var actualizarUsoDelRegistro
var intervaloDevalidacionDeCampos
var minutosDeInactividad = 10
var numerosDeRegistro = []
var ropaAValidar = []

var elementosDeCambio = [
    'puestoDesempenado',
    'calificacionProfesional',
    'domiciolioExplotacion',
    'domiciolioExplotacionAFIP',
    'empleadorActividad',
    'categoriaEmpleado',
    'modalidadLiquicion',
    'obraSocial',
    'EMC',
    'ECC',
    'ESR',
    'tipoSueldo',
    'EGTS',
    'ETS'
]

$(document).ready(function () {
    NOMBRE = window.location.href.slice(window.location.href.indexOf('validacion')).replace("validacion", "").replace("/", "").replaceAll("%20", " ")
    var selectorUnidadGG = ''
    var fultrosucursal = ''
    var filtrocliente = ''
    var selectorEstado = ''
    var unaFecha = null
    var unafechaIngreso = null

    // $("#usuarioLogeado").append(sesion.get('usuarioLogueado'))

    $("#categoriaEmpleado").change(function (event) {
        seRegistroActividad()
        value = $(this).val();
        $('#codigocategoriaEmpleado').val(parcearActividad((value + "").replace("  ", "")))
    });


    elementosDeCambio.forEach(element => {
        cambiosEnElemento(element)
    });

    function cambiosEnElemento(idElemento) {
        $("#" + idElemento + "").change(function (event) {
            seRegistroActividad()
        });
    }

    $('#fultrosucursal').on("keyup", (event) => {
        if ($("#fultrosucursal").val().length > 2 || $("#fultrosucursal").val().length == 0) {
            fultrosucursal = $("#fultrosucursal").val()
            traerDatosParaLaTabla()
        }
    });

    $('#filtrocliente').on("keyup", (event) => {
        if ($("#filtrocliente").val().length > 2 || $("#filtrocliente").val().length == 0) {
            filtrocliente = $("#filtrocliente").val()
            traerDatosParaLaTabla()
        }
    });

    $("#camposDelValidador").on('click', function (event) {
        $('#camposModalDelValidador').show()
        $('#camposModalDeRopa').hide()

        $('#camposDelValidador').children().removeClass()
        $('#camposDelValidador').children().addClass('nav-link tamanoTextoMediano active')

        $('#camposDeRopa').children().removeClass()
        $('#camposDeRopa').children().addClass('nav-link tamanoTextoMediano')
    })

    $("#camposDeRopa").on('click', function (event) {
        $('#camposModalDelValidador').hide()
        $('#camposModalDeRopa').show()

        $('#camposDelValidador').children().removeClass()
        $('#camposDelValidador').children().addClass('nav-link tamanoTextoMediano')

        $('#camposDeRopa').children().removeClass()
        $('#camposDeRopa').children().addClass('nav-link tamanoTextoMediano active')
    })


    $('.fechadatepicker').datepicker({
        format: 'dd-mm-yyyy',
        language: 'es',
        // startDate: 'date.now()',
        autoclose: true,
    }).datepicker("setDate", 'now')

    $('#remuPactada').mask('###############.#0', {
        "placeholder": "",
        reverse: true,
        translation: {
            '#': {
                pattern: /-|\d/,
                recursive: true
            }
        },
        onChange: function (value, e) {
            e.target.value = value.replace(/(?!^)-/g, '').replace(/^,/, '').replace(/^-,/, '-');
        }
    })

    $("#selectorUnidadGG").change(function (event) {
        selectorUnidadGG = $(this).val();
        traerDatosParaLaTabla()
    });

    $("#selectorEstado").change(function (event) {
        selectorEstado = $(this).val();
        traerDatosParaLaTabla()
    });

    $("#ECC").change(function (event) {
        seRegistroActividad()
        if ($("#ECC").val() == "9999/99") {
            $('#categoriaEmpleado').val('').trigger('change');
            // $('#categoriaEmpleado').prop("disabled", true);
            $('#codigocategoriaEmpleado').val('999999')
            // $('#codigocategoriaEmpleado').prop("disabled", true);
            // $('#puestoDesempenado').prop("disabled", false);
        } else {
            // $('#categoriaEmpleado').prop("disabled", false);
            // $('#codigocategoriaEmpleado').prop("disabled", false);
            // $('#puestoDesempenado').prop("disabled", true);
            // $('#codigocategoriaEmpleado').val('')
        }
    });

    $("#empleadorActividad").change(function (event) {
        seRegistroActividad()
        if (semaforo2 == 1) {
            SelectorFiltro()
        }
        semaforo2 = 1
    });

    $("#domiciolioExplotacion").change(function (event) {
        seRegistroActividad()
        // if (semaforo == 1) {
        semaforo = 0
        let data = $('#domiciolioExplotacion').select2('data');
        if (data) {
            if (data[0]) {
                if (data[0].element) {
                    if (data[0].element.attributes) {
                        if (data[0].element.attributes['data-loccpostal']) {
                            datos.empleador_DomCP = data[0].element.attributes['data-loccpostal'].value
                            datos.empleador_DomCalle = data[0].element.attributes['data-domcallenombre'].value
                            datos.empleador_DomLocalidad = data[0].element.attributes['data-locnombre'].value
                            datos.empleador_DomProvincia = data[0].element.attributes['data-prvnombre'].value
                            datos.empleador_DomNumero = data[0].element.attributes['data-domcallenro'].value
                            datos.nodonro_nc = data[0].element.attributes['data-nodonro_nc'].value
                            datos.DomNro = data[0].element.attributes['data-DomNro'].value
                            SelectorFiltro()
                        }
                    }
                }
            }
        }
        semaforo = 1
    });

    $("#CUIL").inputmask("99-99999999-9").on('blur', function () {
        validarFormatoCuitOCuil("CUIL")
    });
    $("#CUIT").inputmask("99-99999999-9").on('blur', function () {
        validarFormatoCuitOCuil("CUIT")
    });

    $(".confirmar").on('click', function (event) {
        if (validarCampos(true)) {
            actualizarValores()
        }
    })

    $("#limpiarCampos").on('click', function (event) {
        selectorUnidadGG = ''
        fultrosucursal = ''
        selectorEstado = ''
        unaFecha = null
        unafechaIngreso = null
        $('#fechaFiltro').val(null).trigger('change');
        $('#fechaIngreso').val(null).trigger('change');
        traerDatosParaLaTabla()
    })

    document.getElementById("limpiarCampos").click()

    $("#refresh").on('click', function (event) {
        traerDatosParaLaTabla()
    })

    $("#btnagregarRegistro").on('click', function (event) {
        numeroDeRegistro++
        agregarRegistro(numeroDeRegistro)
        cagarSelectorestiposIndumentaria(numeroDeRegistro)

        $("#divTalles" + numeroDeRegistro).hide()
        $("#divCantidad" + numeroDeRegistro).hide()

        $("#tiposIndumentaria" + numeroDeRegistro).change(function (event) {
            valor = $(this).val();

            if (valor != '') {
                $("#divCantidad" + $(this).attr('data-val')).show()
                $("#cantIndumentaria" + $(this).attr('data-val')).val(1)
                $("#divTalles" + $(this).attr('data-val')).show()
                cagarIndumentaria($(this).attr('data-val'), valor)
            } else {
                $("#divTalles" + $(this).attr('data-val')).hide()
                $("#divCantidad" + $(this).attr('data-val')).hide()
            }
        });

        $("#btneliminarRegistroRopa" + numeroDeRegistro).on('click', function (event) {
            $("#ropa" + $(this).attr('data-val')).remove()
        })
    })

    $("#llevaRopa").on('click', function (event) {
        numeroDeRegistro = 0
        ropaAValidar = 0
        if ($('#llevaRopa').is(':checked')) {
            $("#camposDeRopa").show()
            $("#listadoDeRopa").show()
        } else {
            $("#camposDeRopa").hide()
            $("#listadoDeRopa").hide()
        }
    })

    function agregarRegistro(numero) {

        var html = ''
        html += '<div class="row registroDeRopa" id="ropa' + numero + '"> '
        html += '   <div class="col-2" id="divIndumentaria' + numero + '"> '
        html += '        <div class="form-group d-flex flex-column"> '
        html += '            <label for="indumentaria">Tipo de Indumentaria</label><small '
        html += '               style="color: #17a2b8;"> </small> '
        html += '            <select class="autocomplete form-control tipoIndumentaria" id="tiposIndumentaria' + numero + '" data-val ="' + numero + '" '
        html += '                name="tiposIndumentaria" required> '
        html += '            </select> '
        html += '        </div> '
        html += '   </div> '
        html += '   <div class="col-8" id="divTalles' + numero + '"> '
        html += '       <div class="form-group d-flex flex-column"> '
        html += '           <label for="Indumentaria">Indumentaria</label> '
        html += '           <select class="autocomplete form-control indumentaria" id="talle' + numero + '" '
        html += '               name="talles" required> '
        html += '           </select> '
        html += '       </div> '
        html += '   </div> '
        html += '    <div class="col-1" id="divCantidad' + numero + '"> '
        html += '        <div class="form-group  d-flex flex-column"> '
        html += '            <label for="Indumentaria">Cantidad</label> '
        html += '            <input type="number" class="tamanoTexto form-control cantidad" '
        html += '               min="1" id="cantIndumentaria' + numero + '"> '
        html += '        </div> '
        html += '    </div> '
        html += '    <div class="col-1 btn-sm"> '
        html += '        <br> '
        html += '        <a href="#" id="btneliminarRegistroRopa' + numero + '" data-val ="' + numero + '" '
        html += '         class="btn btn-danger borrar" title="Eliminar Prenda" > '
        html += '            <i class="fas fa-times"></i> '
        html += '        </a> '
        html += '    </div> '
        html += '</div> '

        $('#listadoDeRopa').append(html)

        $('.autocomplete').select2({
            theme: 'bootstrap4'
        });
    }

    var cagarSelectorestiposIndumentaria = async function (numeroDeRegistro) {
        await loadSelectSoloDescripcion('id', 'descripcion', 'tiposIndumentaria' + numeroDeRegistro, URLSERVICIOSVPN + 'tiposIndumentaria', '')
    }

    var cagarIndumentaria = async function (numeroDeRegistro, idTipoDeIndumentaria) {
        await loadSelectSoloDescripcion('ArtCodigo', 'ArtDescripcion', 'talle' + numeroDeRegistro, URLSERVICIOSVPN + 'listadoindumentaria', { idTipoDeIndumentaria: idTipoDeIndumentaria })
    }

    $("#cerrarSesion").on('click', function (event) {
        localStorage.clear();
        sessionStorage.clear();
        sesion.remove('token');
        window.location.href = "./../"
    })

    $(".cerrar").on('click', function (event) {
        setSeDejoDeUsar(datos.idReferencia)
        eventosAlCerrarModal()
        $("#staticBackdrop").modal('hide');
        $(".modal-backdrop").removeClass('show').addClass('hide');
    })

    $(".close").on('click', function (event) {
        setSeDejoDeUsar(datos.idReferencia)
        eventosAlCerrarModal()
    })

    $("#fechaFiltro").change(function (event) {
        unaFecha = $(this).val()
        if (unaFecha != null) {
            traerDatosParaLaTabla()
        }
    });

    $("#fechaIngreso").change(function (event) {
        unafechaIngreso = $(this).val()
        if (unafechaIngreso != null) {
            traerDatosParaLaTabla()
        }
    });

    $("#visualizador_auto").on('click', function (event) {
        window.location.href = "./../visualizadorAuto"
    })

    function traerDatosParaLaTabla(cantidadDeFilas = 5) {
        if (semaforoTabla == 1) {
            semaforoTabla = 0
            traerDatosDeNitro4(fultrosucursal, selectorUnidadGG, selectorEstado, unafechaIngreso, unaFecha, filtrocliente, cantidadDeFilas)
            setTimeout(() => { semaforoTabla = 1 }, 1000)
        }
    }
});

function armarJsonRopa() {
    JsonRopa = []
    for (let index = 1; index <= document.getElementById("listadoDeRopa").children.length; index++) {

        $("#listadoDeRopa")[0].children[0].id.replace('ropa', '')
        
        if (
            $("#tiposIndumentaria" + index).val() != '' && $("#tiposIndumentaria" + index).val() != undefined &&
            $("#talle" + index).val() != '' && $("#talle" + index).val() != undefined &&
            $("#cantIndumentaria" + index).val() != '' && $("#cantIndumentaria" + index).val() != undefined 
        ) {
        let ropa = {
            "nombre_producto": $('#tiposIndumentaria' + index).select2('data')[0].element.attributes['data-descripcion'].value,
            "tiposIndumentaria": $("#tiposIndumentaria" + index).val(),
            "IdArt": $("#talle" + index).val(),
            "Descripcion": $("#talle" + index).select2('data')[0].element.attributes['data-descripcion'].value,
            "Cantidad": $("#cantIndumentaria" + index).val()
        }
            JsonRopa.push(ropa)
        }
    }
    return JsonRopa
}

function traerDatosDeNitro4(unfultrosucursal, unselectorUnidadGG, unSelectorEstado, unafechaIngreso, unafecha, filtrocliente) {
    // console.log('ACTUALIZANDO TABLA')
    var id = 'cargarDatos';
    var headers = [
        "empleado_Sucursal",
        "empleador_razonsocial",
        "unaFechaTabla",
        "razonsocial_clienteGG",
        "empleado_NombreApellido",
        "empleado_Cuil",
        "empleador_DomExplotacion",
        "fechaModificacionmostrar",
        "ErrorTabla",
        "FNDATE",
        "FINICIODATE",
        "botonEliminarRegistro"
    ];
    var columnDef = [
        { width: 80, targets: 0 },
        { minWidth: 85, targets: 2 },
        { width: 150, targets: 4 },
        { width: 100, targets: 5 },
        { width: 170, targets: 6 },
        { width: 120, targets: 7 },
        { width: 150, targets: 8 },
        { "visible": false, targets: 9 },
        { "visible": false, targets: 10 }

    ]

    if (mailsAutorizados.includes(sesion.get('usuarioLogueado'))) {
        $('#columnaEliminar').html('Actualizar Registro <br> / Eliminar')
        columnDef.push({ maxWidth: 5, Width: 5, minWidth: 5, targets: 11 })
    } else {
        $('#columnaEliminar').html('Actualizar Registro ')
        columnDef.push({ maxWidth: 30, targets: 11 })
    }

    cargarTabla(id, headers, evento_datatable, columnDef, unfultrosucursal, unselectorUnidadGG, unSelectorEstado, unafechaIngreso, unafecha, filtrocliente);
}

function validarUso(data, valor) {
    if (valor) {
        setEnUso(data.idReferencia)
        procesoDeinicialAlMostrarModal(data)
    } else {
        alert('Este registro esta siendo modificado por otro usuario')
    }
}

function bloquearModal() {

    elementosDeCambio.forEach(element => {
        $('#' + element + '').select2('close');
    });
    $('.confirmar').hide();

    setSeDejoDeUsar(datos.idReferencia)
    limpiarValores()
    limpiarcolores()
    eventosAlCerrarModal()
    clearInterval(intervaloDevalidacionDeCampos)
    semaforoInterval = 0
    $('#camposAlertas').html('')
    $('#camposFaltantes').html('')
    $('#camposFaltantes2').html('')
    $(".confirmar").prop("disabled", true);
    $('#formdocumentos').hide()
    $('#mensajeDeBloqueo').html('Se libero el registro de Alta Temprana por tiempo de inactividad')
}

function procesoDeinicialAlMostrarModal(data) {
    datos = {}

    $('#mensajeDeBloqueo').html('')
    $('#formdocumentos').show()
    $('.confirmar').show();
    limpiarValores()
    limpiarcolores()
    datos = data
    semaforo = 0
    $('#staticBackdrop').attr("data-keyboard", "false")
    $('#staticBackdrop').attr("data-backdrop", "static")
    $('#staticBackdrop').modal('show')
    temporizadoresDeModal(datos)

    $(".confirmar").prop("disabled", true);
    $(".cerrar").prop("disabled", true);
    $('#listadoDeRopa').html('')
    $('#camposModalDelValidador').show()
    $('#camposModalDeRopa').hide()
    $('#llevaRopa').prop('checked', parseInt(0))
    $('#camposDelValidador').children().removeClass()
    $('#camposDelValidador').children().addClass('nav-link active')

    $("#camposDeRopa").hide()
    $('#camposDeRopa').children().removeClass()
    $('#camposDeRopa').children().addClass('nav-link tamanoTextoMediano')

    setTimeout(() => {
        mapearDatosInput()
    }, 800)
    setTimeout(() => {
        $(".cerrar").prop("disabled", false);
    }, 6000)
}

function eventosAlCerrarModal() {
    clearInterval(actualizarUsoDelRegistro)
    clearTimeout(bloqueoDeModal)
}

function temporizadoresDeModal(datos) {
    actualizarUsoDelRegistro = setInterval(() => {
        setEnUso(datos.idReferencia)
    }, 20000)
    seRegistroActividad()
}


function seRegistroActividad() {
    clearTimeout(bloqueoDeModal)
    bloqueoDeModal = setTimeout(function () {
        bloquearModal()
    }, 1000 * (60 * minutosDeInactividad))
}

function evento_datatable(data) {
    if (abrirModal) {
        console.log(data)
        seEstaUsando(data, data.idReferencia, validarUso)
    }
}

function limpiarValores() {
    semaforo = 0
    $('#puestokatena').html('')
    $('#obraSocial').val('').trigger('change');
    $('#categoriaEmpleado').val('').trigger('change');
    $('#codigocategoriaEmpleado').val('')
    $('#ECC').val('').trigger('change');
    $('#empleadorActividad').val('').trigger('change');
    $('#domiciolioExplotacion').val('').trigger('change');
    $('#puestoDesempenado').val('').trigger('change');
    $('#tipoSueldo').val('').trigger('change');
    $('#EMC').val('').trigger('change');
    $('#ESR').val('').trigger('change');
    $('#EGTS').val('').trigger('change');
    $('#ETS').val('').trigger('change');
    $('#idNitro4').val('');
    $('#Proceso').val('')
    $('#idReferencia').val('')
    $('#nombreApellido').val('')
    $('#CUIL').val('')
    $('#DNI').val('')
    $('#fechaInicio').datepicker('');
    $('#cliente').val('')
    $('#unidad_gg').val('')
    $('#EmpleadoSucursal').val('')
    $('#CUIT').val('')
    $('#modalidadLiquicion').val('')
    $('#remuPactada').val('')
    $('#empleadoAgricola').prop('checked', parseInt(0))
    $('#empladoRegimen').prop('checked', parseInt(0))
    $('#licCovid').prop('checked', parseInt(0))
    $('#ClausulaNoRepeticion').prop('checked', parseInt(0))
    $('#LlevaRopa').prop('checked', parseInt(0))
    // $('#prepaga').prop('checked', parseInt(0))
    $('#calificacionProfesional').val('').trigger('change');
    $('#observaciones').html('')
}

async function buscarDatosSelectores() {
    var where = {
        "emprsocial": datos.empleador_razonsocial,
        "empcuit": datos.cuit_clienteGG
    }
    cargarJson('descripcion', 'descripcion', 'puestoDesempenado', 'puestoDesempenado')
    cargarJson('codigo', 'descripcion', 'EMC', 'EMC')
    cargarJson('codigo', 'descripcion', 'ESR', 'ESR')
    cargarJson('codigo', 'descripcion', 'EGTS', 'EGTS')
    cargarJson('codigo', 'descripcion', 'ETS', 'ETS')
    cargarJson('codigo', 'descripcion', 'modalidadLiquicion', 'modalidadLiquicion')

    loadSelectCategoria('CatCodigoAfip', 'catnro', 'catnombre', 'categoriaEmpleado', URLSERVICIOSVPN + 'categorias', '')

    res = await loadSelect('OSocCodigo', 'OSocNombre', 'obraSocial', URLSERVICIOSVPN + 'ObraSocial', '')
    res = await loadSelect('CnvReducido', 'CnvNombre', 'ECC', URLSERVICIOSVPN + 'Convenio', '')
    res = await loadSelect('ActAfipCodigo', 'ActAfipNombre', 'empleadorActividad', URLSERVICIOSVPN + 'Actividad', '')
    res = await loadSelect('CProNro', 'CProNom', 'calificacionProfesional', URLSERVICIOSVPN + 'calificacionProfesional', '')
    res = await loadSelectEXP('DomNro', 'DOMEXP', 'domiciolioExplotacion', URLSERVICIOSVPN + 'domicilio', where, datos.empleador_DomExplotacion)

}

var semaforoSelects = 0
var semaforoSelectsAfip = 0
function SelectorFiltro() {
    if (semaforoSelectsAfip == 0) {
        semaforoSelectsAfip = 1
        loadSelectAFIP('Sucursal', 'Direccion', 'domiciolioExplotacionAFIP');
        // $('#empleadorActividad').prop("disabled", true);
        setTimeout(() => {
            semaforoSelectsAfip = 0
        }, 1000)
    }
}

function Loadtrigger() {
    semaforoSelects++
    if (semaforoSelects == 6) {
        semaforoSelects = 0
        $('#obraSocial').val((datos.empleado_ObraSocial != null ? datos.empleado_ObraSocial : '').replaceAll(' ', '')).trigger('change');
        $('#categoriaEmpleado').val((datos.empleado_Categoria == null ? datos.empleado_Categoria : '')).trigger('change');
        $('#codigocategoriaEmpleado').val(datos.empleado_Categoria)
        $('#ECC').val(datos.empleado_ConvenioNumero).trigger('change');
        $('#empleadorActividad').val(datos.empleador_Actividad).trigger('change');
        $('#domiciolioExplotacion').val(datos.IdDomKtena).trigger('change');
        $('#puestoDesempenado').val((datos.empleado_PuestoDesemp == null ? datos.empleado_PuestoDesemp : '')).trigger('change');
        $('#calificacionProfesional').val(datos.calificacionProfesional).trigger('change');
        $('#tipoSueldo').val(datos.tipoSueldo).trigger('change');
        $('#EMC').val(datos.empleado_ModalidadContrato == 'x' ? '014' : datos.empleado_ModalidadContrato).trigger('change');
        $('#ESR').val(datos.empleador_razonsocial == "GESTION LABORAL S.A." ? "42" : datos.empleado_Situacion_Revista).trigger('change');
        $('#EGTS').val(datos.empleado_GrupoTipoServicio).trigger('change');
        $('#ETS').val(datos.empleado_TipoServicio).trigger('change');
        $('#modalidadLiquicion').val(datos.empleado_ModLiquidacion).trigger('change');
        esGL()
        $(".confirmar").prop("disabled", false);
        $(".cerrar").prop("disabled", false);

        if (semaforoInterval == 0) {
            semaforoInterval = 1
            init_intervaloDevalidacionDeCampos()
        }
        SelectorFiltro()
    }
}

function init_intervaloDevalidacionDeCampos() {
    intervaloDevalidacionDeCampos = setInterval(() => {
        validarCampos(false)
    }, 1000)
}

function esGL() {
    if (datos.empleador_razonsocial == "GESTION LABORAL S.A.") {
        $('#ESR').prop("disabled", true);
    } else {
        $('#ESR').prop("disabled", false);
    }
}

function mapearDatosInput() {
    $("#loader").show()
    // console.log(datos)
    $('#idNitro4').val(datos.idNitro4);
    $('#Proceso').val(datos.Proceso)
    $('#idReferencia').val(datos.idReferencia)
    $('#nombreApellido').val(datos.empleado_NombreApellido)
    $('#CUIL').val(datos.empleado_Cuil)
    $('#DNI').val(datos.empleado_Dni)
    $('#fechaInicio').datepicker('setDate', datos.empleado_FechaInicio);
    $('#cliente').val(datos.razonsocial_clienteGG)
    $('#unidad_gg').val(datos.empleador_razonsocial)
    $('#EmpleadoSucursal').val(datos.empleado_Sucursal)
    $('#codigocategoriaEmpleado').val(datos.empleado_Categoria)
    $('#CUIT').val(datos.empleador_Cuit)
    $('#remuPactada').val(datos.empleado_RetribucionPactada)
    $('#empleadoAgricola').prop('checked', parseInt(datos.empleado_TrabAgropecuario))
    $('#empladoRegimen').prop('checked', parseInt(datos.empleado_Regimen))
    $('#licCovid').prop('checked', parseInt(datos.empleado_Lic_COVID))
    $('#ClausulaNoRepeticion').prop('checked', parseInt(datos.ClausulaNoRepeticion))
    // if (datos.empleado_prepaga != undefined) {
    //     $('#prepaga').prop('checked', parseInt(datos.empleado_prepaga))//
    // } else {
    //     $('#prepaga').prop('checked', 0)
    // }

    if (datos.empleado_PuestoDesemp) {
        $('#puestokatena').html(" ( " + datos.empleado_PuestoDesemp + " ) ")
    }

    if (datos.ComentariosAlta != '' && datos.ComentariosAlta != undefined) {
        $('#observaciones').html('<div class="alert alert-primary" style="width: 100%;" role="alert"> Obs. de Seleccion: ' + datos.ComentariosAlta + '</div>')
    }
    if (prueba == true) {
        traerDatos(URLSERVICIOSVPN + 'traerDatos', '');
    } else {
        buscarDatosSelectores()
    }
}

var errores = []

function validarFormatoCuitOCuil(val) {
    if (!($("#" + val).val().replaceAll('_', '').replaceAll('-', '').length == 11)) {
        errores.push(val + ' ')
        iderrores.push(val)
        document.getElementById(val).style.background = '#e59191';
    } else {
        document.getElementById(val).style.background = 'none';
    }
}

function getTipoDeIndumentaria(posicion) {
    return $(".registroDeRopa")[posicion]
}

function getValorGetTipoDeIndumentaria(posicion) {
    return (getTipoDeIndumentaria(posicion)).getElementsByClassName('tipoIndumentaria')[0]
}

function getValorgetIndumentaria(posicion) {
    return (getTipoDeIndumentaria(posicion)).getElementsByClassName('indumentaria')[0]
}

function getValorGetCantidad(posicion) {
    return (getTipoDeIndumentaria(posicion)).getElementsByClassName('cantidad')[0]
}


function validarCampos(alerta) {
    limpiarcolores()
    errores = []
    iderrores = []

    esVacio('nombreApellido', 'Nombre y Apellido')
    // esVacio('CUIL', 'CUIL')
    validarFormatoCuitOCuil("CUIL")
    esVacio('DNI', 'DNI')
    esVacioSelect('obraSocial', 'Obra Social', 'select2-obraSocial-container')
    esVacioSelect('tipoSueldo', 'Tipo sueldo', 'select2-tipoSueldo-container')
    esVacio('unidad_gg', 'Unidad de GG')
    esVacio('cliente', 'Cliente')
    esVacioSelect('ECC', 'Empleado Convenio Colectivo', 'select2-ECC-container')
    esVacioSelect('domiciolioExplotacion', 'Domiciolio Explotación', 'select2-domiciolioExplotacion-container')
    esVacioSelect('empleadorActividad', 'Empleador Actividad', 'select2-empleadorActividad-container')
    esVacioSelect('calificacionProfesional', 'Calificacion Profesional', 'select2-calificacionProfesional-container')
    esVacio('EmpleadoSucursal', 'Empleado Sucursal')
    esVacio('EGTS', 'Empleado Grupo Tipo Servicio')
    esVacio('ETS', 'Empleado Tipo Servicio')
    esVacio('CUIT', 'CUIT')
    validarFormatoCuitOCuil("CUIT")
    esVacio('EMC', 'Empleado Modalidad Contrato')
    esVacio('ESR', 'Empleado Situación Revista')
    esVacio('fechaInicio', 'Fecha Inicio')
    esVacioSelect('modalidadLiquicion', 'Modalidad Liquidación', 'select2-modalidadLiquicion-container')
    esVacio('remuPactada', 'Remuneración Pactada')

    validarCampoCategoria()
    validarDomicilioDeExportacion()

    for (let index = 0; index < $(".registroDeRopa").length; index++) {

        let idselelcTipo = getValorGetTipoDeIndumentaria(index).id
        let idselectIndumentaria = getValorgetIndumentaria(index).id
        let idImputCantidad = getValorGetCantidad(index).id

        esVacioSelect(idselelcTipo, 'El tipo de Indumentaria numero :' + (index + 1), 'select2-' + idselelcTipo + '-container')
        esVacioSelect(idselectIndumentaria, 'La Indumentaria numero :' + (index + 1), 'select2-' + idselectIndumentaria + '-container')
        esVacio(idImputCantidad, 'La cantidad numero :' + (index + 1))
    }

    if (errores.length == 0) {
        $("#camposFaltantes").html('<p style="color:#1fd420;font-size: ' + tamanoDeLetras + 'px">Campos completos</p>')
        $("#camposFaltantes2").html('<p style="color:#1fd420;font-size: ' + tamanoDeLetras + 'px">Campos completos</p>')
        return true
    }

    let actividad

    if ($('#domiciolioExplotacionAFIP').val() != null) {
        actividad = $('#domiciolioExplotacionAFIP').select2('data')[0].element.attributes['data-ActividadAFIP'].value;
    }
    $("#camposAlertas").html('')

    if ($('#empleadorActividad').val() != actividad) {
        $("#camposAlertas").html('<p style="color:#17a2b8;font-size: ' + tamanoDeLetras + 'px">Atención: el código de Actividad del domicilio de explotación de AFIP difiere con la Actividad declarada para el empleador.</p>')
    }

    if (errores.length == 1) {
        $("#camposFaltantes").html('<p style="color:#ff0018;font-size: ' + tamanoDeLetras + 'px ">Complete el siguiente campo: ' + errores + '</p>')
        $("#camposFaltantes2").html('<p style="color:#ff0018;font-size: ' + tamanoDeLetras + 'px ">Complete el siguiente campo: ' + errores + '</p>')
        iderrores.forEach(element => {
            document.getElementById(element).style.background = '#e59191';
        });
        if (alerta) {
            alert("Complete el campo: " + errores[0])
        }
    }
    if (errores.length > 1) {
        $("#camposFaltantes").html('<p style="color:#ff0018;font-size: ' + tamanoDeLetras + 'px " >Complete los siguientes campos: ' + errores + '</p>')
        $("#camposFaltantes2").html('<p style="color:#ff0018;font-size: ' + tamanoDeLetras + 'px " >Complete los siguientes campos: ' + errores + '</p>')
        iderrores.forEach(element => {
            document.getElementById(element).style.background = '#e59191';
            if (document.querySelector('[aria-labelledby="' + element + '"]')) {
                document.querySelector('[aria-labelledby="' + element + '"]').style.background = '#e59191'
            }
        });
        if (alerta) {
            alert("Complete los campos: " + errores)
        }
    }
}

function validarCampoCategoria() {
    if ($("#ECC").val() == "9999/99") {
        esVacioSelect('puestoDesempenado', 'Puesto Desempeñado', 'select2-puestoDesempenado-container')
    } else {
        esVacioSelect('puestoDesempenado', 'Puesto Desempeñado', 'select2-puestoDesempenado-container')

        esVacioSelect('categoriaEmpleado', 'Categoría Empleado', 'select2-categoriaEmpleado-container')
        esVacio('codigocategoriaEmpleado', 'Codigo categoría Empleado')

        if ($("#codigocategoriaEmpleado").val().length != 6 || $("#codigocategoriaEmpleado").val() == "999999" || !validarQueSeanSoloNumeros($("#codigocategoriaEmpleado").val())) {
            document.getElementById('codigocategoriaEmpleado').style.background = '#e59191';
            errores.push('Codigo categoria es incorrecto' + ' ')
            iderrores.push('codigocategoriaEmpleado')
        }
    }
}

function validarQueSeanSoloNumeros(codigo) {
    const regex = /^[0-9]*$/
    return regex.test(codigo) && codigo.length == 6
}

function validarDomicilioDeExportacion() {
    if ($('#domiciolioExplotacion').val() == null || $('#domiciolioExplotacion').val() == '') {
        $('#domiciolioExplotacion').val('').trigger('change')
        document.getElementById('select2-domiciolioExplotacion-container').style.background = '#e59191';
        errores.push('Domicilio explotacion es incorrecto' + ' ')
        iderrores.push('domiciolioExplotacion')
    } else {
        if ($('#domiciolioExplotacion').val().includes("n/a") || $('#domiciolioExplotacion').val().includes("null") || datos.empleador_DomNumero.toUpperCase() == "S/N") {
            if ($("#domiciolioExplotacionAFIP").val() == "") {
                document.getElementById('select2-domiciolioExplotacion-container').style.background = '#e59191';
                errores.push('Domicilio explotacion es incorrecto' + ' ')
                iderrores.push('domiciolioExplotacion')
            }
        }

    }

    if (!datos.nodonro_nc) {
        document.getElementById('select2-domiciolioExplotacion-container').style.background = '#e59191';
        if (!errores.includes('Domicilio explotacion es incorrecto' + ' ')) {
            errores.push('Domicilio explotacion es incorrecto' + ' ')
            iderrores.push('domiciolioExplotacion')
        }
    }

    if ($("#domiciolioExplotacionAFIP").val() == "seleccione") {
        document.getElementById('select2-domiciolioExplotacionAFIP-container').style.background = '#e59191';
        errores.push('Seleccione un domicilio Explotación AFIP' + ' ')
        iderrores.push('domiciolioExplotacionAFIP')
    }
}

function limpiarcolores() {
    ['nombreApellido',
        'CUIL', 'DNI', 'select2-obraSocial-container', 'unidad_gg', 'cliente',
        'select2-ECC-container', 'select2-domiciolioExplotacion-container', 'select2-domiciolioExplotacionAFIP-container', 'select2-empleadorActividad-container',
        'select2-categoriaEmpleado-container', 'codigocategoriaEmpleado', 'EmpleadoSucursal', 'EGTS', 'select2-puestoDesempenado-container',
        'ETS', 'CUIT', 'EMC', 'ESR', 'fechaInicio', 'modalidadLiquicion', 'select2-modalidadLiquicion-container', 'select2-calificacionProfesional-container', 'select2-tipoSueldo-container',
        'remuPactada'].forEach(element => {
            // console.log(element)
            document.getElementById(element).style.background = 'none';
            if (document.querySelector('[aria-labelledby="' + element + '"]')) {
                document.querySelector('[aria-labelledby="' + element + '"]').style.background = 'none'
            }
        });

    for (let index = 0; index < $(".registroDeRopa").length; index++) {

        let moduloRopa = ['select2-'+getValorGetTipoDeIndumentaria(index).id+'-container','select2-'+ getValorgetIndumentaria(index).id + '-container', getValorGetCantidad(index).id]

        moduloRopa.forEach(element => {
            // console.log(element)
            document.getElementById(element).style.background = 'none';
            if (document.querySelector('[aria-labelledby="' + element + '"]')) {
                document.querySelector('[aria-labelledby="' + element + '"]').style.background = 'none'
            }
        });
    }
}

function actualizarValores() {

    //  actualizarcodigocategoriaEmpleado(URLSERVICIOSVPN + 'actualizarcodigocategoriaEmpleado')

    var data = {}
    data.empleador_Cuit = $('#CUIT').val();
    data.empleador_Actividad = parcearActividad($('#empleadorActividad').val());
    // data.empleador_DomExplotacion = $('#domiciolioExplotacion').val();
    data.empleado_ObraSocial = $('#obraSocial').val().replaceAll(' ', '');
    data.empleado_NombreApellido = $('#nombreApellido').val();
    data.empleado_Dni = $('#DNI').val();
    data.empleado_Cuil = $('#CUIL').val();
    data.empleado_Sucursal = $('#EmpleadoSucursal').val();
    data.empleado_ConvenioNumero = $('#ECC').val();
    data.empleado_Categoria = $('#codigocategoriaEmpleado').val();
    data.empleado_PuestoDesemp = $('#puestoDesempenado').val();
    data.empleado_GrupoTipoServicio = $('#EGTS').val();
    data.empleado_TipoServicio = $('#ETS').val();
    data.empleado_ModalidadContrato = $('#EMC').val();
    data.empleado_Situacion_Revista = $('#ESR').val();
    data.empleado_ModLiquidacion = $('#modalidadLiquicion').val();
    data.empleado_RetribucionPactada = $('#remuPactada').val();
    data.empleado_TrabAgropecuario = $('#empleadoAgricola').is(':checked') ? '1' : '0';
    data.empleado_FechaInicio = $('#fechaInicio').val();
    data.empleado_Regimen = $('#empladoRegimen').is(':checked') ? '1' : '0';
    data.empleado_Lic_COVID = $('#licCovid').is(':checked') ? '1' : '0';
    data.razonsocial_clienteGG = $('#cliente').val();
    data.ClausulaNoRepeticion = $('#ClausulaNoRepeticion').is(':checked') ? '1' : '0';
    // data.empleado_prepaga = $('#prepaga').is(':checked') ? '1' : '0';
    data.empleador_DomCP = datos.empleador_DomCP;
    data.empleador_DomCalle = datos.empleador_DomCalle;
    data.empleador_DomLocalidad = datos.empleador_DomLocalidad;
    data.empleador_DomNumero = datos.empleador_DomNumero;
    data.empleador_DomProvincia = datos.empleador_DomProvincia;
    data.empleador_SucAfip = datos.empleador_SucAfip;
    data.idDomKtena = $('#domiciolioExplotacion').val()
    data.nodonro_nc = datos.nodonro_nc;
    data.tipoSueldo = $("#tipoSueldo").val();
    data.calificacionProfesional = $('#calificacionProfesional').val();
    data.IdDomKtena = datos.DomNro;
    data.idcatKtna = $('#categoriaEmpleado').val();
    data.empleador_razonsocial = datos.empleador_razonsocial
    if ($('#llevaRopa').is(':checked')) {
        data.ropa = armarJsonRopa()
    }

    var generaAcuse = false

    if(data.ropa.length > 0){
        generaAcuse = true
    }
    // console.log(data)
    var valores = JSON.stringify(data)
    $('#Proceso').val(datos.Proceso)
    $('#idReferencia').val(datos.idReferencia)

    $("#staticBackdrop").modal('hide');
    $(".modal-backdrop").removeClass('show').addClass('hide');

    if (datos.nodonro_nc) {
        ejecutarActualizacionDatos(valores,generaAcuse)
    } else {
        alert('El domicilio de explotacion seleccionado no registra datos necesarios para completar el proceso')
    }

}

function parcearActividad(valor) {
    if (valor.length == 1) {
        return '00000' + valor
    }
    if (valor.length == 2) {
        return '0000' + valor
    }
    if (valor.length == 3) {
        return '000' + valor
    }
    if (valor.length == 4) {
        return '00' + valor
    }
    if (valor.length == 5) {
        return '0' + valor
    }
    if (valor.length == 6) {
        return valor
    }

}

