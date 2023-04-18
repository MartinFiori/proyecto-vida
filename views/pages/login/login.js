$(document).ready(function () {
    localStorage.clear()
    sessionStorage.clear()
    sesion.remove('token');
    $("#login").on('click', function (event) {
        ajax("POST", 'login-nitro4', {
            idEmpresa: 4,
            usuario: 'Cron',
            clave: 'Jphlions135!'
        }, function (respuesta) {
            if (respuesta.estado == 1) {
                sesion.set('token', respuesta.token);
                sesion.set('usuario', respuesta.usuario);
                sesion.set('idUsuario', respuesta.resultados.idUsuario);
                login($("#usuario").val(), $("#password").val())
            }
        }, function (respuesta) {
            alert(respuesta.mensaje)
        });
    })
});