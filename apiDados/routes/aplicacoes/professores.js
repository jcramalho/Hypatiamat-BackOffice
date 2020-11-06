var express = require('express');
var router = express.Router();
var passport = require('passport')

var Professores = require('../../controllers/db_aplicacoes/professor')
var Turmas = require('../../controllers/db_aplicacoes/turmas')

/* GET todos os professores. */
router.get('/', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  Professores.getProfessores()
             .then(dados =>{
               res.jsonp(dados)
             })
             .catch(erro => res.status(500).jsonp(erro))
});

/* GET Informação de um professor através do seu id. */
router.get('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  Professores.getProfessorById(req.params.id)
             .then(dados =>{
               res.jsonp(dados)
             })
             .catch(erro => res.status(500).jsonp(erro))
});

/* GET Devolve as turmas de um professor através do seu id. */
router.get('/:id/turmas', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  Turmas.getTurmasByProfessor(req.params.id)
             .then(dados =>{
               res.jsonp(dados)
             })
             .catch(erro => res.status(500).jsonp(erro))
});

/* PUT Alterar um professor. */
router.put('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  Professores.alteraProfessor(req.params.id, req.body)
             .then(dados =>{
               res.jsonp(dados)
             })
             .catch(erro => res.status(500).jsonp(erro))
});

/* PUT Alterar a passwrod de um professor. */
router.put('/:id/password', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  Professores.updatePassword(req.params.id, req.body)
             .then(dados =>{
               res.jsonp(dados)
             })
             .catch(erro => res.status(500).jsonp(erro))
});

/* POST Insere um professor. */
router.post('/', function(req, res, next) {
  Professores.insertProfessor(req.body)
             .then(dados =>{
               res.jsonp(dados)
             })
             .catch(erro => res.status(500).jsonp(erro))
});


/* DELETE Apagar um professor. */
router.delete('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  Professores.deleteById(req.params.id)
             .then(dados =>{
               res.jsonp(dados)
             })
             .catch(erro => res.status(500).jsonp(erro))
});

module.exports = router;
