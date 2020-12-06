var express = require('express');
var router = express.Router();
var passport = require('passport')

var Alunos = require('../../controllers/db_aplicacoes/alunos')
var Turmas = require('../../controllers/db_aplicacoes/turmas')

// Todas as turmas
router.get('/', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    Turmas.getTurmas()
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
  });

// Informação de uma turma
router.get('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    Turmas.getTurmaById(req.params.id)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
  });

// Devolve todos os alunos de uma determinada turma
router.get('/:id/alunos', passport.authenticate('jwt', {session: false}), function(req, res){
    var turma = req.params.id
    var codprofessor = req.query.codprofessor
    Alunos.getAlunosFromTurma(turma, codprofessor)
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

// Devolve todos os jogos uma determinada turma jogou
router.get('/:id/jogos', passport.authenticate('jwt', {session: false}), function(req, res){
  var turma = req.params.id
  var escola = req.query.escola
  Turmas.getJogos(turma, escola)
             .then(jogos =>{
              /*
               TurmasOld.getAlunosFromTurma(turma)
                        .then(alunosOld =>{
                          res.jsonp({alunosAtuais : alunosAtuais, alunosOld : alunosOld})
                        })
                        .catch(erro => res.status(500).jsonp(erro))
              */
              res.jsonp(jogos)
             })
             .catch(erro => res.status(500).jsonp(erro))
})


// Devolve todos os resultados de um jogo de uma turma
router.get('/:id/jogos/:tableJogo',  function(req, res){
  var turma = req.params.id
  var tableJogo = req.params.tableJogo
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var jogoTipo = req.query.jogoTipo
  var escola = req.query.escola
  Turmas.getJogosFromTurma(dataInicio, dataFim, jogoTipo, tableJogo, turma, escola)
             .then(alunosAtuais =>{
              
              res.jsonp(alunosAtuais)
             })
             .catch(erro => res.status(500).jsonp(erro))
})

//Insere uma nova turma
router.post('/', passport.authenticate('jwt', {session: false}), function(req, res){
    Turmas.insertTurma(req.body)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
})

//Altera uma turma
router.put('/:id', passport.authenticate('jwt', {session: false}), function(req, res){
  Turmas.updateTurma(req.params.id, req.body)
             .then(dados =>{
               res.jsonp(dados)
             })
             .catch(erro => res.status(500).jsonp(erro))
})


// Apaga uma determinado turma
router.delete('/:id', passport.authenticate('jwt', {session: false}), function(req, res){
    Turmas.apagar(req.params.id, req.query.codprofessor)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
})




module.exports = router