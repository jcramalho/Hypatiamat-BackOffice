var express = require('express');
var router = express.Router();
var passport = require('passport');
var verifyToken = require('../../config/verifyToken')

const Jogos = require('../../controllers/db_samd/jogos');
const Rankings = require('../../controllers/db_samd/rankings');
const Calcrapid = require('../../controllers/db_samd/calcrapid');
const Calculus = require('../../controllers/db_samd/calculus');
const JogosGerais = require('../../controllers/db_samd/jogosGeral');

// Todas os jogos
router.get('/', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    Jogos.getJogos()
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

// Calcrapid por municipios
router.get('/calcrapid/municipios', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
  var tipo = req.query.tipo
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  if(tipo && tipo.length > 0){
    Calcrapid.getCalcRapidTipoMunicipios(dataInicio, dataFim, tipo.split(','))
              .then(dados =>{
                res.jsonp(dados)
              })
              .catch(erro => res.status(500).jsonp(erro))
  }
  else{
    Calcrapid.getTodosCalcRapidMunicipios(dataInicio, dataFim)
              .then(dados =>{
                res.jsonp(dados)
              })
              .catch(erro => res.status(500).jsonp(erro))
  }
});

router.get('/minutenew/municipios', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var niveis = req.query.niveis
  var tipos = req.query.tipos
  if(tipos && niveis){
    Calculus.getTiposNiveisMinuteNewMunicipios(dataInicio, dataFim, niveis.split(","), tipos)
              .then(dados => res.jsonp(dados))
              .catch(erro => res.status(500).jsonp(erro))
  }
  else if(tipos){
    Calculus.getTiposMinuteNewMunicipios(dataInicio, dataFim, tipos)
              .then(dados => res.jsonp(dados))
              .catch(erro => res.status(500).jsonp(erro)) 
  }
  else if(niveis){
    Calculus.getNiveisMinuteNewMunicipios(dataInicio, dataFim, niveis.split(","))
              .then(dados => res.jsonp(dados))
              .catch(erro => res.status(500).jsonp(erro)) 
  }
  else{
    Calculus.getTodosMinuteNewMunicipios(dataInicio, dataFim)
              .then(dados => res.jsonp(dados))
              .catch(erro => res.status(500).jsonp(erro))
  }
});

// Pontuações de jogos gerais ou de todos por municipio
router.get('/:jogo/municipios', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var jogoTipo = req.query.jogoTipo
  var jogoTable = req.params.jogo
  if(jogoTable == "Todos"){
    Jogos.getAllJogosMunicipios(dataInicio, dataFim)
              .then(dados => res.jsonp(dados))
              .catch(erro => res.status(500).jsonp(erro))
  }
  else{
    JogosGerais.getJogoMunicipios(jogoTable, jogoTipo, dataInicio, dataFim)
              .then(dados => res.jsonp(dados))
              .catch(erro => res.status(500).jsonp(erro))
  }
});

// Calcrapid por municipios de uma comunidade
router.get('/calcrapid/comunidades/:comunidade', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  var tipo = req.query.tipo
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var comunidade = req.params.comunidade
  if(tipo && tipo.length > 0){
    Calcrapid.getCalcRapidTipoComunidade(dataInicio, dataFim, tipo.split(','), comunidade)
              .then(dados =>{
                res.jsonp(dados)
              })
              .catch(erro => res.status(500).jsonp(erro))
  }
  else{
    Calcrapid.getTodosCalcRapidComunidade(dataInicio, dataFim, comunidade)
              .then(dados =>{
                res.jsonp(dados)
              })
              .catch(erro => res.status(500).jsonp(erro))
  }
});

// Calculus por municipios de uma comunidade
router.get('/minutenew/comunidades/:comunidade', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var niveis = req.query.niveis
  var tipos = req.query.tipos
  var comunidade = req.params.comunidade
  if(tipos && niveis){
    Calculus.getTiposNiveisMinuteNewComunidade(dataInicio, dataFim, niveis.split(","), tipos, comunidade)
          .then(dados => res.jsonp(dados))
          .catch(erro => res.status(500).jsonp(erro))
  }
  else if(tipos){
    Calculus.getTiposMinuteNewComunidade(dataInicio, dataFim, tipos, comunidade)
          .then(dados => res.jsonp(dados))
          .catch(erro => res.status(500).jsonp(erro)) 
  }
  else if(niveis){
    Calculus.getNiveisMinuteNewComunidade(dataInicio, dataFim, niveis.split(","), comunidade)
          .then(dados => res.jsonp(dados))
          .catch(erro => res.status(500).jsonp(erro)) 
  }
  else{
    Calculus.getTodosMinuteNewComunidade(dataInicio, dataFim, comunidade)
          .then(dados => res.jsonp(dados))
          .catch(erro => res.status(500).jsonp(erro))
  }
});

// Jogo da jogosdb por municipios de uma comunidade
router.get('/:jogo/comunidades/:comunidade', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  var tipo = req.query.tipo
  var jogo = req.params.jogo
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var comunidade = req.params.comunidade
  if(dataInicio && dataFim && comunidade){
    if(jogo && tipo){
      JogosGerais.getJogoComunidade(comunidade, jogo, tipo, dataInicio, dataFim)
          .then(dados => res.jsonp(dados))
          .catch(erro => res.status(500).jsonp(erro))
    }
    else{
      // todos, caso não se receba (principalmente) um tipo de jogo
      Jogos.getAllJogosComunidade(comunidade, dataInicio, dataFim)
           .then(dados => res.jsonp(dados))
           .catch(erro => res.status(500).jsonp(erro))
    }
  }
  else res.status(400).jsonp("Faltam parâmetros.")
});



// Calcrapid por agrupamentos de um municipio
router.get('/calcrapid/municipios/:municipio', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  var tipo = req.query.tipo
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var municipio = req.params.municipio
  if(tipo && tipo.length > 0){
    Calcrapid.getCalcRapidTipoAgrupamentos(dataInicio, dataFim, tipo.split(','), municipio)
              .then(dados =>{
                res.jsonp(dados)
              })
              .catch(erro => res.status(500).jsonp(erro))
  }
  else{
    Calcrapid.getTodosCalcRapidAgrupamentos(dataInicio, dataFim, municipio)
              .then(dados =>{
                res.jsonp(dados)
              })
              .catch(erro => res.status(500).jsonp(erro))
  }
});

router.get('/minutenew/municipios/:municipio', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdminEMunicipio(), function(req, res, next) {
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var niveis = req.query.niveis
  var tipos = req.query.tipos
  var municipio = req.params.municipio
  if(tipos && niveis){
    Calculus.getTiposNiveisMinuteNewAgrupamentos(municipio, dataInicio, dataFim, niveis.split(","), tipos)
              .then(dados => res.jsonp(dados))
              .catch(erro => res.status(500).jsonp(erro))
  }
  else if(tipos){
    Calculus.getTiposMinuteNewAgrupamentos(municipio, dataInicio, dataFim, tipos)
              .then(dados => res.jsonp(dados))
              .catch(erro => res.status(500).jsonp(erro)) 
  }
  else if(niveis){
    Calculus.getNiveisMinuteNewAgrupamentos(municipio, dataInicio, dataFim, niveis.split(","))
              .then(dados => res.jsonp(dados))
              .catch(erro => res.status(500).jsonp(erro)) 
  }
  else{
    Calculus.getTodosMinuteNewAgrupamentos(municipio, dataInicio, dataFim)
              .then(dados => res.jsonp(dados))
              .catch(erro => res.status(500).jsonp(erro))
  }
});

// Pontuações de jogos por escola de um municipio
router.get('/:jogo/municipios/:municipio', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdminEMunicipio(), function(req, res, next) {
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var jogoTipo = req.query.jogoTipo
  var jogoTable = req.params.jogo
  var municipio = req.params.municipio
  if(jogoTable == 'Todos'){
    Jogos.getAllJogosEscolas(dataInicio, dataFim, municipio)
            .then(dados =>res.jsonp(dados))
            .catch(erro => res.status(500).jsonp(erro))
  }
  else{
    JogosGerais.getJogoEscolas(jogoTable, jogoTipo, dataInicio, dataFim, municipio)
                .then(dados => res.jsonp(dados))
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
    Calcrapid.getTiposCalcRapidProfessores(dataInicio, dataFim, tipo.split(','), escola)
              .then(dados => res.jsonp(dados))
              .catch(erro => res.status(500).jsonp(erro))
  }
  else{
    Calcrapid.getTodosCalcRapidProfessores(dataInicio, dataFim, escola)
              .then(dados => res.jsonp(dados))
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
    Calculus.getTiposNiveisMinuteNewProfessores(escola, dataInicio, dataFim, niveis.split(","), tipos)
              .then(dados => res.jsonp(dados))
              .catch(erro => res.status(500).jsonp(erro))
  }
  else if(tipos){
    Calculus.getTiposMinuteNewProfessores(escola, dataInicio, dataFim, tipos)
              .then(dados => res.jsonp(dados))
              .catch(erro => res.status(500).jsonp(erro)) 
  }
  else if(niveis){
    Calculus.getNiveisMinuteNewProfessores(escola, dataInicio, dataFim, niveis.split(","))
              .then(dados => res.jsonp(dados))
              .catch(erro => res.status(500).jsonp(erro)) 
  }
  else{
    Calculus.getTodosMinuteNewProfessores(escola, dataInicio, dataFim)
              .then(dados => res.jsonp(dados))
              .catch(erro => res.status(500).jsonp(erro))
  }
});

// Devolve estatisticas globais sobre os professores da escola
router.get('/:jogo/escolas/:codigo', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin_Municipio_Agrupamento(), function(req, res){
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var jogoTipo = req.query.jogoTipo
  var jogoTable = req.params.jogo
  var escola = req.params.codigo
  if(jogoTable != "Todos"){
    JogosGerais.getJogoProfessores(jogoTable, jogoTipo, dataInicio, dataFim, escola)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).jsonp(erro))
  }
  else{
    Jogos.getAllJogosProfessores(dataInicio, dataFim, escola)
          .then(dados => res.jsonp(dados))
          .catch(erro => res.status(500).jsonp(erro))
  }
})

// Calcrapid por aluno de uma turma
router.get('/calcrapid/turmas/:turma', passport.authenticate('jwt', {session: false}), verifyToken.verifyTurma3(), function(req, res, next) {
  var tipo = req.query.tipo
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var turma = req.params.turma
  var escola = req.query.escola
  if(tipo && tipo.length > 0){
    Calcrapid.getTiposCalcRapidTurmas(dataInicio, dataFim, tipo.split(','), escola, turma)
              .then(dados => res.jsonp(dados))
              .catch(erro => res.status(500).jsonp(erro))
  }
  else{
    Calcrapid.getTodosCalcRapidTurmas(dataInicio, dataFim, escola, turma)
              .then(dados => res.jsonp(dados))
              .catch(erro => res.status(500).jsonp(erro))
  }
});

router.get('/minutenew/turmas/:turma', passport.authenticate('jwt', {session: false}), verifyToken.verifyTurma3(), function(req, res, next) {
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var niveis = req.query.niveis
  var tipos = req.query.tipos
  var turma = req.params.turma
  var escola = req.query.escola
  if(tipos && niveis){
    Calculus.getTiposNiveisMinuteNewTurma(turma, escola, dataInicio, dataFim, niveis.split(","), tipos)
              .then(dados => res.jsonp(dados))
              .catch(erro => res.status(500).jsonp(erro))
  }
  else if(tipos){
    Calculus.getTiposMinuteNewTurma(turma, escola, dataInicio, dataFim, tipos)
              .then(dados => res.jsonp(dados))
              .catch(erro => res.status(500).jsonp(erro)) 
  }
  else if(niveis){
    Calculus.getNiveisMinuteNewTurma(turma, escola, dataInicio, dataFim, niveis.split(","))
              .then(dados => res.jsonp(dados))
              .catch(erro => res.status(500).jsonp(erro)) 
  }
  else{
    Calculus.getTodosMinuteNewTurma(turma, escola, dataInicio, dataFim)
              .then(dados => res.jsonp(dados))
              .catch(erro => res.status(500).jsonp(erro))
  }
});

// Devolve todos as estatísticas de um jogo de uma turma
router.get('/:tableJogo/turmas/:turma', passport.authenticate('jwt', {session: false}), verifyToken.verifyTurma3(),  function(req, res){
  var turma = req.params.turma
  var tableJogo = req.params.tableJogo
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var jogoTipo = req.query.jogoTipo
  var escola = req.query.escola
  if(dataInicio && dataFim && escola){
    if(tableJogo != "Todos"){
      JogosGerais.getJogoFromTurma(dataInicio, dataFim, jogoTipo, tableJogo, turma, escola)
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro))
    }
    else{
      Jogos.getAllJogosTurma(dataInicio, dataFim, turma, escola)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).jsonp(erro))
    }
  }
  else res.status(400).send('Faltam parâmetros...')
})

router.get('/calcrapid/turmas/:turma/ranking', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  var turma = req.params.turma
  var escola = req.query.escola
  var codprofessor = req.query.codprofessor
  var anoletivo = req.query.anoletivo
  var tipo = req.query.tipo
  if(turma && escola && codprofessor && anoletivo){
    var aux = anoletivo.split("/")
    if(aux.length == 2){
      var dataInicio = aux[0] + "-09-01"
      var dataFim = aux[1] + "-09-01"
      if(tipo){
        Rankings.calculaRankingTurmaCalcRapidTipos(turma, escola, codprofessor, dataInicio, dataFim, tipo.split(','))
              .then(dados => res.jsonp(dados))
              .catch(error => { console.log(error); res.status(500).jsonp("Error")})
      }
      else{
        Rankings.calculaRankingTurmaCalcRapid(turma, escola, codprofessor, dataInicio, dataFim)
              .then(dados => res.jsonp(dados))
              .catch(error => { console.log(error); res.status(500).jsonp("Error")})
      }
    }
    else res.status(400).jsonp("Ano letivo tem de ser do formato YYYY/YYYY.")
  }
  else res.status(400).jsonp("Faltam parâmetros.")

});


router.get('/minutenew/turmas/:turma/ranking', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  var turma = req.params.turma
  var escola = req.query.escola
  var codprofessor = req.query.codprofessor
  var anoletivo = req.query.anoletivo
  var tipos = req.query.tipos
  var niveis = req.query.niveis
  if(turma && escola && codprofessor && anoletivo){
    var aux = anoletivo.split("/")
    if(aux.length == 2){
      var dataInicio = aux[0] + "-09-01"
      var dataFim = aux[1] + "-09-01"
      if(tipos && niveis){
        Rankings.calculaRankingTurmaMinuteNewNiveisTipos(turma, escola, codprofessor, dataInicio, dataFim, niveis.split(","), tipos)
                  .then(dados =>{
                    res.jsonp(dados)
                  })
                  .catch(erro => res.status(500).jsonp(erro))
      }
      else if(tipos){
        Rankings.calculaRankingTurmaMinuteNewTipos(turma, escola, codprofessor, dataInicio, dataFim, tipos)
                  .then(dados =>{
                    res.jsonp(dados)
                  })
                  .catch(erro => res.status(500).jsonp(erro)) 
      }
      else if(niveis){
        Rankings.calculaRankingTurmaMinuteNewNiveis(turma, escola, codprofessor, dataInicio, dataFim, niveis.split(","))
                  .then(dados =>{
                    res.jsonp(dados)
                  })
                  .catch(erro => res.status(500).jsonp(erro)) 
      }
      else{
        Rankings.calculaRankingTurmaMinuteNew(turma, escola, codprofessor, dataInicio, dataFim)
                  .then(dados =>{
                    res.jsonp(dados)
                  })
                  .catch(erro => res.status(500).jsonp(erro))
      }
    }
    else res.status(400).jsonp("Ano letivo tem de ser do formato YYYY/YYYY.")
  }
  else res.status(400).jsonp("Faltam parâmetros.")

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


module.exports = router