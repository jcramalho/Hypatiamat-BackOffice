var express = require('express');
var router = express.Router();

var Alunos = require('../../controllers/db_aplicacoes/alunos')
var Turmas = require('../../controllers/db_aplicacoes/turmas')

// Todas as turmas
router.get('/', function(req, res, next) {
    Turmas.getTurmas()
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
  });

// Informação de uma turma
router.get('/:id', function(req, res, next) {
    Turmas.getTurmaById(req.params.id)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
  });

// Devolve todos os alunos de uma determinada turma
router.get('/:id/alunos', function(req, res){
    var turma = req.params.id
    Alunos.getAlunosFromTurma(turma)
               .then(alunosAtuais =>{
                /*
                 TurmasOld.getAlunosFromTurma(turma)
                          .then(alunosOld =>{
                            res.jsonp({alunosAtuais : alunosAtuais, alunosOld : alunosOld})
                          })
                          .catch(erro => res.status(500).jsonp(erro))
                */
                res.jsonp(alunosAtuais)
               })
               .catch(erro => res.status(500).jsonp(erro))
})

//Insere uma nova turma
router.post('/', function(req, res){
    Turmas.insertTurma(req.body)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
})


// Apaga uma determinado turma
router.delete('/:id', function(req, res){
    Turmas.deleteTurma(req.params.id)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
})




module.exports = router