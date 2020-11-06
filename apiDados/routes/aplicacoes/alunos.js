var express = require('express');
var router = express.Router();

var Alunos = require('../../controllers/db_aplicacoes/alunos');
const TurmaOld = require('../../controllers/db_aplicacoes/turmasold');

/* GET todos os alunos. */
router.get('/', function(req, res, next) {
    Alunos.getAlunos()
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

/* GET devolve a informação de um aluno. */
router.get('/:user', function(req, res, next) {
    Alunos.getAluno(req.params.user)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

/* PUT altera a informação de um aluno. */
router.put('/:user', function(req, res, next) {
    Alunos.updateAluno(req.params.user, req.body)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

/* PUT altera a turma de um aluno. */
router.put('/:user/turma', function(req, res, next) {
    Alunos.updateTurma(req.params.user, req.body.turma)
               .then(dados =>{
                    //TurmaOld.insertTurmaOld()
                    res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

/* POST insere um novo aluno. */
router.post('/', function(req, res, next) {
    Alunos.insertAluno(req.body)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

/* DELETE apaga um aluno. */
router.delete('/:user', function(req, res, next) {
    Alunos.deleteAluno(req.params.user)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

module.exports = router