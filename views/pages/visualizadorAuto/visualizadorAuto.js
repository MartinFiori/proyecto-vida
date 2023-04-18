$(document).ready(function () {
    $("#validador").on('click', function (event) {
        window.location.href = "validacion"
    })

    $("#cerrarSesion").on('click', function (event) {
        localStorage.clear();
        sessionStorage.clear();
        sesion.remove('token');
        window.location.href = "./../"
    })
})
