var express = require('express');
var router = express.Router();

var AddHypatia = require('../../controllers/db_samd/addhypatia');

// Todas os registos
router.get('/', function(req, res, next) {
    AddHypatia.getRegistos()
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

// Um determinado registo
router.get('/:id', function(req, res, next) {
    AddHypatia.getRegisto(req.params.id)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

// Todas os registos de um aluno
router.get('/alunos/:idAluno', function(req, res, next) {
    AddHypatia.getRegistosFromAluno(req.params.idAluno)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

// A média de pontuação de um aluno no jogo
router.get('/alunos/:idAluno/media', function(req, res, next) {
    AddHypatia.getAlunoMedia(req.params.idAluno)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

// Todas os registos de uma turma
router.get('/turmas/:idturma', function(req, res, next) {
    AddHypatia.getRegistosFromTurma(req.params.idturma)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

// Top 100 de uma escola
router.get('/escolas/:idescola', function(req, res, next) {
    AddHypatia.getTop100FromEscola(req.params.idescola)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});



module.exports = router