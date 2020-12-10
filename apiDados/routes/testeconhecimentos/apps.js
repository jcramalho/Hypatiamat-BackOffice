var express = require('express');
var router = express.Router();

var Apps = require('../../controllers/db_testeconhecimentos/apps');

// Todas os temas das apps
router.get('/temas', function(req, res, next) {
    Apps.getTemas()
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

// Todas os resultados de uma app ou de todas as apps por munícipio
router.get('/municipios', function(req, res, next) {
    var dataInicio = req.query.dataInicio;
    var dataFim = req.query.dataFim;

    if(req.query.appid){
        //implementar
        var appid = req.query.appid
        res.jsonp(0)
    }
    else{
        Apps.getAllAppsFromMunicipios(dataInicio, dataFim)
            .then(dados =>{
                res.jsonp(dados)
            })
            .catch(erro => res.status(500).jsonp(erro))
    }          
});

// Todas os resultados de uma app ou de todas as apps por escola de um municipio
router.get('/municipios/:municipio', function(req, res, next) {
    var dataInicio = req.query.dataInicio;
    var dataFim = req.query.dataFim;
    var municipio = req.params.municipio

    if(req.query.appid){
        //implementar
        var appid = req.query.appid
        res.jsonp(0)
    }
    else{
        Apps.getAllAppsFromMunicipio(municipio, dataInicio, dataFim)
            .then(dados =>{
                res.jsonp(dados)
            })
            .catch(erro => res.status(500).jsonp(erro))
    }          
});

// Todas os resultados de uma app ou de todas as apps por professor de uma escola
router.get('/escolas/:escola', function(req, res, next) {
    var dataInicio = req.query.dataInicio;
    var dataFim = req.query.dataFim;
    var escola = req.params.escola

    if(req.query.appid){
        //implementar
        var appid = req.query.appid
        res.jsonp(0)
    }
    else{
        Apps.getAllAppsFromEscola(escola, dataInicio, dataFim)
            .then(dados =>{
                res.jsonp(dados)
            })
            .catch(erro => res.status(500).jsonp(erro))
    }          
});

// Todas os resultados de uma app ou de todas as apps de uma turma
router.get('/turmas/:turma', function(req, res, next) {
    var dataInicio = req.query.dataInicio;
    var dataFim = req.query.dataFim;
    var turma = req.params.turma
    var codProf = req.query.codProf

    if(req.query.appid){
        //implementar
        var appid = req.query.appid
        res.jsonp(0)
    }
    else{
        Apps.getAllAppsFromTurma(turma, codProf, dataInicio, dataFim)
            .then(dados =>{
                res.jsonp(dados)
            })
            .catch(erro => res.status(500).jsonp(erro))
    }          
});

module.exports = router