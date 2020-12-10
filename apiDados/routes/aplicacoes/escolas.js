var express = require('express');
var router = express.Router();
var passport = require('passport')

var Alunos = require('../../controllers/db_aplicacoes/alunos')
var Professores = require('../../controllers/db_aplicacoes/professor')
var Turmas = require('../../controllers/db_aplicacoes/turmas')
var Escolas = require('../../controllers/db_aplicacoes/escolas')

// Todas as escolas
router.get('/', function(req, res, next) {
    Escolas.getEscolas()
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
  });

// Informação de uma escola
router.get('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    Escolas.getEscola(req.params.id)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
  });

// Devolve todos os alunos de uma determinada escola
router.get('/:id/alunos', passport.authenticate('jwt', {session: false}), function(req, res){
  Alunos.getAlunosFromEscola(req.params.id)
             .then(alunosAtuais =>{
              res.jsonp(alunosAtuais)
             })
             .catch(erro => res.status(500).jsonp(erro))
})

// Devolve todos os professores de uma determinada escola
router.get('/:id/professores', passport.authenticate('jwt', {session: false}), function(req, res){
  Professores.getProfessoresByEscola(req.params.id)
             .then(alunosAtuais =>{
              res.jsonp(alunosAtuais)
             })
             .catch(erro => res.status(500).jsonp(erro))
})

// Devolve todos as turmas de uma determinada escola
router.get('/:id/turmas', passport.authenticate('jwt', {session: false}), function(req, res){
  Professores.getTurmasFromEscola(req.params.id)
             .then(turmas =>{
              res.jsonp(turmas)
             })
             .catch(erro => res.status(500).jsonp(erro))
})

// Todas as escolas de um país
router.get('/paises/:pais', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    Escolas.getEscolasByPais(req.params.pais)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
  });

// Todas as escolas de um distrito
router.get('/distritos/:distrito', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    Escolas.getEscolasByDistrito(req.params.distrito)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
  });

  // Todas as escolas de uma localidade
router.get('/localidades/:localidade', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    Escolas.getEscolasByLocalidade(req.params.localidade)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
  });

  // Pontuações de jogos por municipio
  router.get('/jogos/:jogo/municipios', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var dataInicio = req.query.dataInicio
    var dataFim = req.query.dataFim
    var jogoTipo = req.query.jogoTipo
    var jogoTable = req.params.jogo
    Escolas.getJogosMunicipio(jogoTable, jogoTipo, dataInicio, dataFim)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
  });

  // Devolve estatisticas globais sobre os professores da escola
router.get('/:id/jogos/professores', passport.authenticate('jwt', {session: false}), function(req, res){
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var jogoTipo = req.query.jogoTipo
  var jogoTable = req.query.jogoTable
  var escola = req.params.id
  Escolas.getJogosProfessores(jogoTable, jogoTipo, dataInicio, dataFim, escola)
             .then(turmas =>{
              res.jsonp(turmas)
             })
             .catch(erro => res.status(500).jsonp(erro))
})

    // Pontuações de jogos por escola de um municipio
    router.get('/jogos/:jogo/municipios/:municipio', passport.authenticate('jwt', {session: false}), function(req, res, next) {
      var dataInicio = req.query.dataInicio
      var dataFim = req.query.dataFim
      var jogoTipo = req.query.jogoTipo
      var jogoTable = req.params.jogo
      var municipio = req.params.municipio
      Escolas.getJogosEscolas(jogoTable, jogoTipo, dataInicio, dataFim, municipio)
                 .then(dados =>{
                   res.jsonp(dados)
                 })
                 .catch(erro => res.status(500).jsonp(erro))
    });
  

//Insere uma nova escola
router.post('/', function(req, res){
    Escolas.insertEscola(req.body)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
})


// Apaga uma determinado escola
router.delete('/:id', passport.authenticate('jwt', {session: false}), function(req, res){
    Escolas.apagar(req.params.id)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
})




module.exports = router