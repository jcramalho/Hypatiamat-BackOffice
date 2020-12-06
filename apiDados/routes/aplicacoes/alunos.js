var express = require('express');
var router = express.Router();
var passport = require('passport')

var Alunos = require('../../controllers/db_aplicacoes/alunos');
const TurmaOld = require('../../controllers/db_aplicacoes/turmasold');


router.get('/', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    Alunos.getAlunos()
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

/* GET devolve a informação de um aluno. */
router.get('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    Alunos.getAluno(req.params.id)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

/* GET devolve todos os registos de um jogo de um aluno. */
router.get('/:user/jogos/:jogoTable', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  Alunos.getJogosFromAluno(req.query.dataInicio, req.query.dataFim, req.query.jogoTipo, req.params.jogoTable, req.params.user)
             .then(dados =>{
               res.jsonp(dados)
             })
             .catch(erro => res.status(500).jsonp(erro))
});

/* GET devolve as estatisticas gerais de um jogo de um aluno. */
router.get('/:user/jogosGlobal/:jogoTable', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  Alunos.getJogosGlobalFromAluno(req.query.dataInicio, req.query.dataFim, req.query.jogoTipo, req.params.jogoTable, req.params.user)
             .then(dados =>{
               res.jsonp(dados)
             })
             .catch(erro => res.status(500).jsonp(erro))
});

/* PUT altera a informação de um aluno. */
router.put('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    Alunos.updateAluno(req.params.id, req.body)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});


/* PUT altera a escola de um aluno. */
router.put('/:id/escola', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  Alunos.updateTurma(req.params.id, req.body.turma)
             .then(dados =>{
                  //TurmaOld.insertTurmaOld()
                  res.jsonp(dados)
             })
             .catch(erro => res.status(500).jsonp(erro))
});

/* PUT altera a turma de um aluno. */
router.put('/:id/turma', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    Alunos.updateTurma(req.params.id, req.body.turma)
               .then(dados =>{
                    //TurmaOld.insertTurmaOld()
                    res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

/* PUT altera a password de um aluno. */
router.put('/:id/password', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  Alunos.updateTurma(req.params.id, req.body.password)
             .then(dados =>{
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
router.delete('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    Alunos.deleteAluno(req.params.id)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

module.exports = router