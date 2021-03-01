var express = require('express');
var router = express.Router();
var passport = require('passport');
const Turma = require('../../controllers/db_aplicacoes/turmas');

var Jogos = require('../../controllers/db_samd/jogos');
var Rankings = require('../../controllers/db_samd/rankings');

// Todas os jogos
router.get('/', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    Jogos.getJogos()
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

// Calcrapid por municipios
router.get('/calcrapid/municipios', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  var tipo = req.query.tipo
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  if(tipo && tipo.length > 0){
    Jogos.getCalcRapidTipoMunicipios(dataInicio, dataFim, tipo.split(','))
              .then(dados =>{
                res.jsonp(dados)
              })
              .catch(erro => res.status(500).jsonp(erro))
  }
  else{
    
    Jogos.getTodosCalcRapidMunicipios(dataInicio, dataFim)
              .then(dados =>{
                res.jsonp(dados)
              })
              .catch(erro => res.status(500).jsonp(erro))
  }
});

// Calcrapid por agrupamentos de um municipio
router.get('/calcrapid/municipios/:municipio', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  var tipo = req.query.tipo
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var municipio = req.params.municipio
  if(tipo && tipo.length > 0){
    Jogos.getCalcRapidTipoAgrupamentos(dataInicio, dataFim, tipo.split(','), municipio)
              .then(dados =>{
                res.jsonp(dados)
              })
              .catch(erro => res.status(500).jsonp(erro))
  }
  else{
    Jogos.getTodosCalcRapidAgrupamentos(dataInicio, dataFim, municipio)
              .then(dados =>{
                res.jsonp(dados)
              })
              .catch(erro => res.status(500).jsonp(erro))
  }
});

// Calcrapid por professor de um agrupamento
router.get('/calcrapid/escolas/:escola', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  var tipo = req.query.tipo
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var escola = req.params.escola
  if(tipo && tipo.length > 0){
    Jogos.getTiposCalcRapidProfessores(dataInicio, dataFim, tipo.split(','), escola)
              .then(dados =>{
                res.jsonp(dados)
              })
              .catch(erro => res.status(500).jsonp(erro))
  }
  else{
    Jogos.getTodosCalcRapidProfessores(dataInicio, dataFim, escola)
              .then(dados =>{
                res.jsonp(dados)
              })
              .catch(erro => res.status(500).jsonp(erro))
  }
});


// Calcrapid por aluno de uma turma
router.get('/calcrapid/turmas/:turma', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  var tipo = req.query.tipo
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var turma = req.params.turma
  var escola = req.query.escola
  if(tipo && tipo.length > 0){
    Jogos.getTiposCalcRapidTurmas(dataInicio, dataFim, tipo.split(','), escola, turma)
              .then(dados =>{
                res.jsonp(dados)
              })
              .catch(erro => res.status(500).jsonp(erro))
  }
  else{
    Jogos.getTodosCalcRapidTurmas(dataInicio, dataFim, escola, turma)
              .then(dados =>{
                res.jsonp(dados)
              })
              .catch(erro => res.status(500).jsonp(erro))
  }
});

router.get('/:jogo/turmas/:turma/ranking', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  var turma = req.params.turma
  var escola = req.query.escola
  var codprofessor = req.query.codprofessor
  var anoletivo = req.query.anoletivo
  var jogo = req.params.jogo 
  var jogoTipo = req.query.jogoTipo
  if(turma && escola && codprofessor && anoletivo && jogo && jogoTipo){
    var aux = anoletivo.split("/")
    if(aux.length == 2){
      var dataInicio = aux[0] + "-09-01"
      var dataFim = aux[1] + "-09-01"
      Rankings.calculaRankingTurma(jogo, jogoTipo, turma, escola, codprofessor, dataInicio, dataFim)
            .then(dados => res.jsonp(dados))
            .catch(error => { console.log(error); res.status(500).jsonp("Error")})
      
    }
    else res.status(400).jsonp("Ano letivo tem de ser do formato YYYY/YYYY.")

  }
  else res.status(400).jsonp("Faltam parâmetros.")

});

router.get('/minutenew/municipios', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var niveis = req.query.niveis
  var tipos = req.query.tipos
  if(tipos && niveis){
    Jogos.getTiposNiveisMinuteNewMunicipios(dataInicio, dataFim, niveis.split(","), tipos)
              .then(dados =>{
                res.jsonp(dados)
              })
              .catch(erro => res.status(500).jsonp(erro))
  }
  else if(tipos){
    Jogos.getTiposMinuteNewMunicipios(dataInicio, dataFim, tipos)
              .then(dados =>{
                res.jsonp(dados)
              })
              .catch(erro => res.status(500).jsonp(erro)) 
  }
  else if(niveis){
    Jogos.getNiveisMinuteNewMunicipios(dataInicio, dataFim, niveis.split(","))
              .then(dados =>{
                res.jsonp(dados)
              })
              .catch(erro => res.status(500).jsonp(erro)) 
  }
  else{
    Jogos.getTodosMinuteNewMunicipios(dataInicio, dataFim)
              .then(dados =>{
                res.jsonp(dados)
              })
              .catch(erro => res.status(500).jsonp(erro))
  }
});

router.get('/minutenew/municipios/:municipio', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var niveis = req.query.niveis
  var tipos = req.query.tipos
  var municipio = req.params.municipio
  if(tipos && niveis){
    Jogos.getTiposNiveisMinuteNewAgrupamentos(municipio, dataInicio, dataFim, niveis.split(","), tipos)
              .then(dados =>{
                res.jsonp(dados)
              })
              .catch(erro => res.status(500).jsonp(erro))
  }
  else if(tipos){
    Jogos.getTiposMinuteNewAgrupamentos(municipio, dataInicio, dataFim, tipos)
              .then(dados =>{
                res.jsonp(dados)
              })
              .catch(erro => res.status(500).jsonp(erro)) 
  }
  else if(niveis){
    Jogos.getNiveisMinuteNewAgrupamentos(municipio, dataInicio, dataFim, niveis.split(","))
              .then(dados =>{
                res.jsonp(dados)
              })
              .catch(erro => res.status(500).jsonp(erro)) 
  }
  else{
    Jogos.getTodosMinuteNewAgrupamentos(municipio, dataInicio, dataFim)
              .then(dados =>{
                res.jsonp(dados)
              })
              .catch(erro => res.status(500).jsonp(erro))
  }
});

router.get('/minutenew/escolas/:escola', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var niveis = req.query.niveis
  var tipos = req.query.tipos
  var escola = req.params.escola
  if(tipos && niveis){
    Jogos.getTiposNiveisMinuteNewProfessores(escola, dataInicio, dataFim, niveis.split(","), tipos)
              .then(dados =>{
                res.jsonp(dados)
              })
              .catch(erro => res.status(500).jsonp(erro))
  }
  else if(tipos){
    Jogos.getTiposMinuteNewProfessores(escola, dataInicio, dataFim, tipos)
              .then(dados =>{
                res.jsonp(dados)
              })
              .catch(erro => res.status(500).jsonp(erro)) 
  }
  else if(niveis){
    Jogos.getNiveisMinuteNewProfessores(escola, dataInicio, dataFim, niveis.split(","))
              .then(dados =>{
                res.jsonp(dados)
              })
              .catch(erro => res.status(500).jsonp(erro)) 
  }
  else{
    Jogos.getTodosMinuteNewProfessores(escola, dataInicio, dataFim)
              .then(dados =>{
                res.jsonp(dados)
              })
              .catch(erro => res.status(500).jsonp(erro))
  }
});

router.get('/minutenew/turmas/:turma', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var niveis = req.query.niveis
  var tipos = req.query.tipos
  var turma = req.params.turma
  var escola = req.query.escola
  if(tipos && niveis){
    Jogos.getTiposNiveisMinuteNewTurma(turma, escola, dataInicio, dataFim, niveis.split(","), tipos)
              .then(dados =>{
                res.jsonp(dados)
              })
              .catch(erro => res.status(500).jsonp(erro))
  }
  else if(tipos){
    Jogos.getTiposMinuteNewTurma(turma, escola, dataInicio, dataFim, tipos)
              .then(dados =>{
                res.jsonp(dados)
              })
              .catch(erro => res.status(500).jsonp(erro)) 
  }
  else if(niveis){
    Jogos.getNiveisMinuteNewTurma(turma, escola, dataInicio, dataFim, niveis.split(","))
              .then(dados =>{
                res.jsonp(dados)
              })
              .catch(erro => res.status(500).jsonp(erro)) 
  }
  else{
    Jogos.getTodosMinuteNewTurma(turma, escola, dataInicio, dataFim)
              .then(dados =>{
                res.jsonp(dados)
              })
              .catch(erro => res.status(500).jsonp(erro))
  }
});


module.exports = router