var express = require('express');
var router = express.Router();

var Exames = require('../../controllers/db_aplicacoes/exames')

// Todas os exames
router.get('/', function(req, res, next) {
    Exames.getExames()
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

// Um determinado exame
router.get('/:id', function(req, res, next) {
    Exames.getExame(req.params.id)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

// Todos os exames realizados de um exame em especifico
router.get('/examenumber/:id', function(req, res, next) {
    Exames.getExamesFromExameNumber(req.params.id)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

// Todos os exames realizados por um utilizador
router.get('/user/:id', function(req, res, next) {
    Exames.getExamesFromUser(req.params.id)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

// Todos os exames realizados numa turma
router.get('/turmas/:id', function(req, res, next) {
    Exames.getExamesFromTurma(req.params.id)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

// Insere um novo exame realizado
router.post('/', function(req, res, next) {
    Exames.insertExame(req.body)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

// Apaga um exame realizado
router.delete('/:id', function(req, res, next) {
    Exames.deleteExame(req.params.id)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

module.exports = router