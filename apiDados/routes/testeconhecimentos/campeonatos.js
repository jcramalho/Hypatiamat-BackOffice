var express = require('express');
var router = express.Router();
var passport = require('passport')
const verifyToken = require('../../config/verifyToken')

const Campeonatos = require('../../controllers/db_testeconhecimentos/campeonatos');
const CampeonatosCRUD = require('../../controllers/db_testeconhecimentos/campeonatosCRUD');


// Todos os campeonatos realizados
router.get('/', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var municipio = req.query.municipio
    if(municipio){
        Campeonatos.getCampeonatosComMunicipio(municipio)
                   .then(dados => res.jsonp(dados))
                   .catch(erro => res.status(500).jsonp('Error'))
    }
    else{
        Campeonatos.getCampeonatos()
                .then(dados =>res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro))
    }
});

// Informação de um campeonato
router.get('/:cod', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    CampeonatosCRUD.getCampeonato(req.params.cod)
                   .then(dados => res.jsonp(dados))
                   .catch(erro => res.status(500).jsonp('Error'))
});

// Estatísticas de um campeonato por todos os municipios ou um só município ou por uma comunidade
router.get('/:campeonato/municipios', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var campeonato = req.params.campeonato;
    var municipio = req.query.municipio;
    var comunidade = req.query.comunidade;
    if(municipio){
        // por um municipio
        Campeonatos.getCampeonatoMunicipio(campeonato, municipio)
                   .then(dados =>res.jsonp(dados))
                   .catch(erro => res.status(500).jsonp(erro))
    }
    else if(comunidade){
        // por uma comunidade
        Campeonatos.getCampeonatoComunidade(campeonato, comunidade)
                   .then(dados =>res.jsonp(dados))
                   .catch(erro => res.status(500).jsonp(erro))
    }
    else{
        // por todos os municipios
        Campeonatos.getCampeonatoMunicipios(campeonato)
                   .then(dados =>res.jsonp(dados))
                   .catch(erro => res.status(500).jsonp(erro))
    }
});

// Estatísticas de um campeonato por todos os municipios ou um só município
router.get('/:campeonato/municipios/gerais', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var campeonato = req.params.campeonato;
    Campeonatos.getCampeonatoMunicipiosGerais(campeonato)
               .then(dados =>res.jsonp(dados))
               .catch(erro => res.status(500).jsonp(erro))
    
});

// Estatísticas de um campeonato por todos os agrupamentos de um municipio ou um só agrupamento
router.get('/:campeonato/municipios/:municipio', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var campeonato = req.params.campeonato;
    var municipio = req.params.municipio
    var escola = req.query.escola;
    if(escola){
        Campeonatos.getCampeonatoAgrupamento(campeonato, escola)
                   .then(dados =>res.jsonp(dados))
                   .catch(erro => res.status(500).jsonp(erro))
    }
    else{
        Campeonatos.getCampeonatoMunicipioAgrupamentos(campeonato, municipio)
                   .then(dados =>res.jsonp(dados))
                   .catch(erro => res.status(500).jsonp(erro))
    }
});

router.get('/:campeonato/escolas/:escola', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var campeonato = req.params.campeonato;
    var escola = req.params.escola;
    Campeonatos.getCampeonatoAgrupamentoProfessores(campeonato, escola)
               .then(dados =>res.jsonp(dados))
               .catch(erro => res.status(500).jsonp(erro))
});

router.get('/:campeonato/turmas/:turma', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var campeonato = req.params.campeonato;
    var turma = req.params.turma;
    var escola = req.query.escola;
    var codprofessor = req.query.codprofessor
    if(codprofessor && turma){
        Campeonatos.getCampeonatoTurma(campeonato, escola, turma, codprofessor)
                    .then(dados =>res.jsonp(dados))
                    .catch(erro => res.status(500).jsonp(erro))
    }
    else res.status(400).send("Faltam parâmetros (turma ou codprofessor)")
});

router.get('/:campeonato/municipios/:municipio/gerais', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var campeonato = req.params.campeonato;
    var municipio = req.params.municipio
    Campeonatos.getCampeonatoMunicipioGerais(campeonato, municipio)
                   .then(dados =>res.jsonp(dados))
                   .catch(erro => res.status(500).jsonp(erro))
});

router.get('/:campeonato/comunidades/:comunidade/gerais', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var campeonato = req.params.campeonato;
    var comunidade = req.params.comunidade
    Campeonatos.getCampeonatoComunidadeGerais(campeonato, comunidade)
                   .then(dados =>res.jsonp(dados))
                   .catch(erro => res.status(500).jsonp(erro))
});

router.put('/:codigo', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    CampeonatosCRUD.updateCampeonato(req.params.codigo, req.body)
                   .then(dados =>res.jsonp(dados))
                   .catch(erro => res.status(500).jsonp(erro))
});

router.post('/', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    CampeonatosCRUD.insertCampeonato(req.body)
                   .then(dados =>res.jsonp(dados))
                   .catch(erro => res.status(500).jsonp(erro))
});

router.delete('/:codigo', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    CampeonatosCRUD.apagarCampeonato(req.params.codigo)
                   .then(dados =>res.jsonp(dados))
                   .catch(erro => res.status(500).jsonp(erro))
});

module.exports = router