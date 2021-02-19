var express = require('express');
var router = express.Router();
var passport = require('passport')

var Jogos = require('../../controllers/db_samd/jogos');

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


module.exports = router