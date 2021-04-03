var express = require('express');
var router = express.Router();
var passport = require('passport')

const Cromos = require('../../controllers/db_testeconhecimentos/cromos');
const CromosAlunos = require('../../controllers/db_testeconhecimentos/cromos_alunos');


router.get('/', function(req, res, next) {
    Cromos.getCromosDB()
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).jsonp('Erro'))
});

router.get('/alunos/:user', function(req, res, next) {
    CromosAlunos.getCromosFromUser(req.params.user)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).jsonp('Erro'))
});

router.get('/novos/alunos/:user', function(req, res, next) {
    //Cromos.getCromosAppsFromAluno(req.params.user)
    Cromos.getNovosCromos(req.params.user)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).jsonp('Erro'))
});

module.exports = router