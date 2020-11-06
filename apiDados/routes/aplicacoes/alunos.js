var express = require('express');
var router = express.Router();
var passport = require('passport')

var Alunos = require('../../controllers/db_aplicacoes/alunos');
const TurmaOld = require('../../controllers/db_aplicacoes/turmasold');

/**
 * @swagger
 * definitions:
 *   Aluno:
 *     properties:
 *       name:
 *         type: string
 *       breed:
 *         type: string
 *       age:
 *         type: integer
 *       sex:
 *         type: string
 */

/* GET todos os alunos. */
router.get('/', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    Alunos.getAlunos()
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

/* GET devolve a informação de um aluno. */
router.get('/:user', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    Alunos.getAluno(req.params.user)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

/* PUT altera a informação de um aluno. */
router.put('/:user', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    Alunos.updateAluno(req.params.user, req.body)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

/* PUT altera a turma de um aluno. */
router.put('/:user/turma', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    Alunos.updateTurma(req.params.user, req.body.turma)
               .then(dados =>{
                    //TurmaOld.insertTurmaOld()
                    res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

/* PUT altera a password de um aluno. */
router.put('/:user/password', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  Alunos.updateTurma(req.params.user, req.body.password)
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
router.delete('/:user', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    Alunos.deleteAluno(req.params.user)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

module.exports = router