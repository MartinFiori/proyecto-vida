$(document).ready(function () {

    // let option = '';
    // option += "<option value='' data-select2-id=''>Seleccione...</option>"
    // option += "<option value='110'>Fin de periodo a prueba (C)</option>"
    // option += "<option value='38'>Baja con telegrama (C)</option>"
    // option += "<option value='146'>Renuncia con telegrama (C)</option>"
    // option += "<option value='37'>Baja efectiva con telegrama (C)</option>"
    // option += "<option value='109'>Baja sin telegrama (A)</option>"
    // option += "<option value='147'>Renuncia sin telegrama (A)</option>"
    // option += "<option value='120'>Baja efectiva sin telegrama (A)</option>"
    // $('#selectorMotivoBaja').html(option)
    $('#loader2').hide()

var errorDeCuit = false
    function validarFormatoCuitOCuil(val) {
        if (!($("#" + val).val().replaceAll('_', '').replaceAll('-', '').length == 11)) {
            errorDeCuit = false
            document.getElementById(val).style.background = '#e59191';
        } else {
            errorDeCuit = true
            document.getElementById(val).style.background = '#FFFFFF';
        }
    }

    $("#cuitEmpleado").inputmask("99-99999999-9").on('blur', function () {
        validarFormatoCuitOCuil("cuitEmpleado")
    });

    $('#buscarEmpleado').on('click',function () {
        
        if(errorDeCuit){
            crearTablaCustom('acuseindumentariacustom',$('#cuitEmpleado').val())
        }else{
            alert('Ingrese un cuit valido')
        }
    })

})

