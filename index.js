"use strict";
var port = 80;
const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const router = express.Router();

app.set("views", path.join(__dirname, "views"));
app.engine(".ejs", require("ejs").__express);
app.use(express.static(path.join(__dirname, "public")));

app.use("/", router);

const server = http.createServer(app);

router.get("/", function (req, res) {
  res.render("./pages/login/login.ejs");
});

router.get("/login", function (req, res) {
  res.render("./pages/login/login.ejs");
});

router.get("/visualizadorAuto", function (req, res) {
  res.render("./pages/visualizadorAuto/visualizadorAuto.ejs");
});

router.get("/validacion/:id?", function (req, res) {
  res.render("./pages/validacion/validacion.ejs", {
    params: JSON.stringify(req.params),
  });
});

router.get("/bajas", function (req, res) {
  res.render("./pages/bajas/bajas.ejs");
});

router.get("/indumentaria", function (req, res) {
  res.render("./pages/indumentaria/indumentaria.ejs");
});

router.get("/anulaciones", function (req, res) {
  res.render("./pages/anulaciones/anulaciones.ejs");
});

router.get("/cargaDeUsuarioAFIP", function (req, res) {
  res.render("./pages/cargaDeUsuarioAFIP/cargaDeUsuarioAFIP.ejs");
});

router.get("/formulario885", (req, res) => {
  res.render("./pages/formulario885/formulario885.ejs");
});

server.listen(port, () => {
  console.log(`Servidor working en puerto ${port}`);
});
