var express = require('express');
var router = express.Router();
var passport = require('passport')

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
router.get('/municipios', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var dataInicio = req.query.dataInicio;
    var dataFim = req.query.dataFim;
    var codtema = req.query.codtema
    var codsubtema = req.query.codsubtema

    if(codtema){
        // É um tema
        if(codsubtema){
            // Com subtema
            Apps.getAppFromMuncipiosSubTema(codtema, codsubtema, dataInicio, dataFim) 
                .then(dados =>{
                    res.jsonp(dados)
                })
                .catch(erro => res.status(500).jsonp(erro)) 
        }
        else{
            // Sem subtema
            Apps.getAppFromMuncipios(codtema, dataInicio, dataFim)
                .then(dados =>{
                    res.jsonp(dados)
                })
                .catch(erro => res.status(500).jsonp(erro)) 
        }
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
router.get('/municipios/:municipio', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var dataInicio = req.query.dataInicio;
    var dataFim = req.query.dataFim;
    var municipio = req.params.municipio
    var codtema = req.query.codtema
    var codsubtema = req.query.codsubtema

    if(codtema){
        // É um tema
        if(codsubtema){
            // com subtema
            Apps.getAppFromMunicipioSubTema(codtema, codsubtema, municipio, dataInicio, dataFim)
                .then(dados =>{
                    res.jsonp(dados)
                })
                .catch(erro => res.status(500).jsonp(erro))
        }
        else{
            // sem subtema
            Apps.getAppFromMunicipio(codtema, municipio, dataInicio, dataFim)
                .then(dados =>{
                    res.jsonp(dados)
                })
                .catch(erro => res.status(500).jsonp(erro))   
        }
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
router.get('/escolas/:escola', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var dataInicio = req.query.dataInicio;
    var dataFim = req.query.dataFim;
    var escola = req.params.escola
    var codtema = req.query.codtema
    var codsubtema = req.query.codsubtema

    if(codtema){
        // é um tema
        if(codsubtema){
            // com subtema
            Apps.getAppFromEscolaSubTema(codtema, codsubtema, escola, dataInicio, dataFim)
                .then(dados =>{
                    res.jsonp(dados)
                })
                .catch(erro => res.status(500).jsonp(erro))
        }
        else{
            // sem subtema
            Apps.getAppFromEscola(codtema, escola, dataInicio, dataFim)
                .then(dados =>{
                    res.jsonp(dados)
                })
                .catch(erro => res.status(500).jsonp(erro))
        }
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
router.get('/turmas/:turma', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var dataInicio = req.query.dataInicio;
    var dataFim = req.query.dataFim;
    var turma = req.params.turma
    var codProf = req.query.codProf
    var codtema = req.query.codtema
    var codsubtema = req.query.codsubtema

    if(codtema){
        // é um tema
        if(codsubtema){
            // com subtema
            Apps.getAppFromTurmaSubTema(codtema, codsubtema, turma, codProf, dataInicio, dataFim)
                .then(dados =>{
                    res.jsonp(dados)
                })
                .catch(erro => res.status(500).jsonp(erro))
        }
        else{
            // sem subtema
            Apps.getAppFromTurma(codtema, turma, codProf, dataInicio, dataFim)
                .then(dados =>{
                    res.jsonp(dados)
                })
                .catch(erro => res.status(500).jsonp(erro))
        }
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