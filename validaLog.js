if (!sesion.get('token') || sesion.get('usuarioLogueado') == null) {
    localStorage.clear()
    sessionStorage.clear()
    sesion.remove('token');
    window.location.href = "./../"
}