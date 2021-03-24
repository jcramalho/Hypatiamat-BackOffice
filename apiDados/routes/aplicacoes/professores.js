var express = require('express');
var router = express.Router();
var passport = require('passport')

var Professores = require('../../controllers/db_aplicacoes/professor')
var Turmas = require('../../controllers/db_aplicacoes/turmas')
var Escolas = require('../../controllers/db_aplicacoes/escolas')
var verifyToken = require('../../config/verifyToken')

/* GET todos os professores. */
router.get('/', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
  Professores.getProfessores()
             .then(dados => res.jsonp(dados))
             .catch(erro => {console.log(erro); res.status(500).send('Erro interno.')})
});

/* GET todos os códigos de professores. */
router.get('/codigos', function(req, res, next) {
  Professores.getProfessoresCodigo()
             .then(dados =>res.jsonp(dados))
             .catch(erro => {console.log(erro); res.status(500).send('Erro interno.')})
});

/* GET todos os códigos de professores. */
router.get('/naoconfirmados', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
  Professores.getProfessoresNaoConfirmados()
             .then(dados => res.jsonp(dados))
             .catch(erro => {console.log(erro); res.status(500).send('Erro interno.')})
});

/* GET Informação de um professor através do seu id. */
router.get('/:id', passport.authenticate('jwt', {session: false}), verifyToken.verifyUserProf(), function(req, res, next) {
  Professores.getProfessorById(req.params.id)
             .then(dados => res.jsonp(dados))
             .catch(erro => {console.log(erro); res.status(500).send('Erro interno.')})
});

/* GET Informação de um professor através do seu id. */
router.get('/codigos/:codigo', passport.authenticate('jwt', {session: false}), verifyToken.verifyUserProf2(), function(req, res, next) {
  Professores.getProfessorByCodigo(req.params.codigo)
             .then(dados =>res.jsonp(dados))
             .catch(erro => {console.log(erro); res.status(500).send('Erro interno.')})
});

/* GET Devolve as turmas de um professor através do seu id (eventualmente pode se passar o ano letivo das turmas). */
router.get('/:codigo/turmas', passport.authenticate('jwt', {session: false}), verifyToken.verifyProfTurmas(), function(req, res, next) {
  var ano = req.query.ano
  if(ano){
    var anoletivo = ano + "/" + (parseInt(ano) + 1)
    Turmas.getTurmasByProfessorAno(req.params.codigo, anoletivo)
             .then(dados => res.jsonp(dados))
             .catch(erro => {console.log(erro); res.status(500).send('Erro interno.')})
  }
  else{
    Turmas.getTurmasByProfessor(req.params.codigo)
              .then(dados => res.jsonp(dados))
              .catch(erro => {console.log(erro); res.status(500).send('Erro interno.')})
  }
});

/* PUT Alterar um professor. */
router.put('/:codigo', passport.authenticate('jwt', {session: false}), verifyToken.verifyUserProf2(), async function(req, res, next) {
  var professor = req.body
  if(professor.nome && professor.escola && professor.email && professor.confirmacao && professor.password 
    && professor.premium && professor.socionum && professor.projeto){

    var escola = await Escolas.getEscola(professor.escola)
    if(escola){
      Professores.alteraProfessor(req.params.codigo, professor)
                .then(dados => res.jsonp(dados))
                .catch(erro => {console.log(erro); res.status(500).send('Erro interno.')})
    }
    else res.status(400).send('Escola do professor inexistente.')
  }
  else res.status(400).send('Algum campo obrigatório não existe.')
});

/* PUT Alterar a passwrod de um professor. */
router.put('/:codigo/password', passport.authenticate('jwt', {session: false}), verifyToken.verifyUserProf2(), function(req, res, next) {
  if(req.body.password){
    Professores.updatePassword(req.params.codigo, req.body.password)
              .then(dados => res.jsonp(dados))
              .catch(erro => {console.log(erro); res.status(500).send('Erro interno.')})
  }
  else res.status(400).send('Algum campo obrigatório não existe.')
});

/* POST Insere um professor. */
router.post('/', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), async function(req, res, next) {
  var professor = req.body

  if(professor.codigo && professor.nome && professor.escola && professor.email && professor.password 
    && professor.premium && professor.socionum && professor.projeto){
      var escola = await Escolas.getEscola(professor.escola)
      if(escola){
        Professores.insertProfessor(professor)
                  .then(dados => res.jsonp(dados))
                  .catch(erro => {console.log(erro); res.status(500).send('Erro interno.')})
      }
      else res.status(400).send('Escola do professor inexistente.')
    }
    else res.status(400).send('Algum campo obrigatório não existe.')
});


/* DELETE Apagar um professor. */
router.delete('/:codigo', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
  Professores.apagar(req.params.codigo)
             .then(dados => res.jsonp(dados))
             .catch(erro => {console.log(erro); res.status(500).send('Erro interno.')})
});

module.exports = router;
