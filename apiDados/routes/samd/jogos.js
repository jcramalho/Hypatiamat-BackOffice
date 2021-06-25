var express = require('express');
var router = express.Router();
var passport = require('passport');
var verifyToken = require('../../config/verifyToken')

const Jogos = require('../../controllers/db_samd/jogos');
const Rankings = require('../../controllers/db_samd/rankings');
const Calcrapid = require('../../controllers/db_samd/calcrapid');
const Calculus = require('../../controllers/db_samd/calculus');
const JogosGerais = require('../../controllers/db_samd/jogosGeral');

// Todos os jogos
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
  if(dataInicio && dataFim){
    if(tipo && tipo.length > 0){
      var tipoParsed = tipo
      if(!Array.isArray(tipo)) tipoParsed = tipo.split(',')
      Calcrapid.getCalcRapidTipoMunicipios(dataInicio, dataFim, tipoParsed)
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
  }
  else res.status(400).send('Falta o intervalo de tempo (dataInicio e dataFim)...')
});

router.get('/minutenew/municipios', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var niveis = req.query.niveis
  var tipos = req.query.tipos
  if(dataInicio && dataFim){

    if(tipos && Array.isArray(tipos)) {
      var aux = ''
      for(var i = 0; i < tipos.length; i++) aux += tipos[i]
      tipos = aux
    }
    if(niveis && !Array.isArray(niveis)) niveis = niveis.split(",")
    
    if(tipos && niveis){
      Calculus.getTiposNiveisMinuteNewMunicipios(dataInicio, dataFim, niveis, tipos)
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro))
    }
    else if(tipos){
      Calculus.getTiposMinuteNewMunicipios(dataInicio, dataFim, tipos)
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro)) 
    }
    else if(niveis){
      Calculus.getNiveisMinuteNewMunicipios(dataInicio, dataFim, niveis)
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro)) 
    }
    else{
      Calculus.getTodosMinuteNewMunicipios(dataInicio, dataFim)
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro))
    }
  }
  else res.status(400).send('Falta o intervalo de tempo (dataInicio e dataFim)...')
});

// Pontuações de jogos gerais ou de todos por municipio
router.get('/:jogo/municipios', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var jogoTipo = req.query.jogoTipo
  var jogoTable = req.params.jogo
  if(dataInicio && dataFim){
    if(jogoTable == "Todos"){
      Jogos.getAllJogosMunicipios(dataInicio, dataFim)
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro))
    }
    else{
      if(jogoTipo){
        JogosGerais.getJogoMunicipios(jogoTable, jogoTipo, dataInicio, dataFim)
                  .then(dados => res.jsonp(dados))
                  .catch(erro => res.status(500).jsonp(erro))
      }
      else res.status(400).send('Falta o tipo de jogo...')
    }
  }
  else res.status(400).send('Falta o intervalo de tempo (dataInicio e dataFim)...')
});

// Calcrapid por municipios de uma comunidade
router.get('/calcrapid/comunidades/:comunidade', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
  var tipo = req.query.tipo
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var comunidade = req.params.comunidade
  if(dataInicio && dataFim){
    if(tipo && tipo.length > 0){
      var tipoParsed = tipo
      if(!Array.isArray(tipo)) tipoParsed = tipo.split(',')
      Calcrapid.getCalcRapidTipoComunidade(dataInicio, dataFim, tipoParsed, comunidade)
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
  }
  else res.status(400).send('Falta o intervalo de tempo (dataInicio e dataFim)...')
});

// Calculus por municipios de uma comunidade
router.get('/minutenew/comunidades/:comunidade', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var niveis = req.query.niveis
  var tipos = req.query.tipos
  var comunidade = req.params.comunidade
  if(dataInicio && dataFim){

    if(tipos && Array.isArray(tipos)) {
      var aux = ''
      for(var i = 0; i < tipos.length; i++) aux += tipos[i]
      tipos = aux
    }
    if(niveis && !Array.isArray(niveis)) niveis = niveis.split(",")
    if(tipos && niveis){
      Calculus.getTiposNiveisMinuteNewComunidade(dataInicio, dataFim, niveis, tipos, comunidade)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).jsonp(erro))
    }
    else if(tipos){
      Calculus.getTiposMinuteNewComunidade(dataInicio, dataFim, tipos, comunidade)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).jsonp(erro)) 
    }
    else if(niveis){
      Calculus.getNiveisMinuteNewComunidade(dataInicio, dataFim, niveis, comunidade)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).jsonp(erro)) 
    }
    else{
      Calculus.getTodosMinuteNewComunidade(dataInicio, dataFim, comunidade)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).jsonp(erro))
    }
  }
  else res.status(400).send('Falta o intervalo de tempo (dataInicio e dataFim)...')
});

// Jogo da jogosdb por municipios de uma comunidade
router.get('/:jogo/comunidades/:comunidade', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
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
router.get('/calcrapid/municipios/:municipio', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdminEMunicipio(), function(req, res, next) {
  var tipo = req.query.tipo
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var municipio = req.params.municipio
  if(dataInicio && dataFim){
    if(tipo && tipo.length > 0){
      var tipoParsed = tipo
      if(!Array.isArray(tipo)) tipoParsed = tipo.split(',')
      Calcrapid.getCalcRapidTipoAgrupamentos(dataInicio, dataFim, tipoParsed, municipio)
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
  }
  else res.status(400).send('Falta o intervalo de tempo (dataInicio e dataFim)...')
});

router.get('/minutenew/municipios/:municipio', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdminEMunicipio(), function(req, res, next) {
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var niveis = req.query.niveis
  var tipos = req.query.tipos
  var municipio = req.params.municipio
  if(dataInicio && dataFim){

    if(tipos && Array.isArray(tipos)) {
      var aux = ''
      for(var i = 0; i < tipos.length; i++) aux += tipos[i]
      tipos = aux
    }
    if(niveis && !Array.isArray(niveis)) niveis = niveis.split(",")

    if(tipos && niveis){
      Calculus.getTiposNiveisMinuteNewAgrupamentos(municipio, dataInicio, dataFim, niveis, tipos)
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro))
    }
    else if(tipos){
      Calculus.getTiposMinuteNewAgrupamentos(municipio, dataInicio, dataFim, tipos)
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro)) 
    }
    else if(niveis){
      Calculus.getNiveisMinuteNewAgrupamentos(municipio, dataInicio, dataFim, niveis)
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro)) 
    }
    else{
      Calculus.getTodosMinuteNewAgrupamentos(municipio, dataInicio, dataFim)
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro))
    }
  }
  else res.status(400).send('Falta o intervalo de tempo (dataInicio e dataFim)...')
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
router.get('/calcrapid/escolas/:codigo', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin_Municipio_Agrupamento(), function(req, res, next) {
  var tipo = req.query.tipo
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var escola = req.params.codigo
  if(dataInicio && dataFim){
    if(tipo && tipo.length > 0){
      var tipoParsed = tipo
      if(!Array.isArray(tipo)) tipoParsed = tipo.split(',')
      Calcrapid.getTiposCalcRapidProfessores(dataInicio, dataFim, tipoParsed, escola)
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro))
    }
    else{
      Calcrapid.getTodosCalcRapidProfessores(dataInicio, dataFim, escola)
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro))
    }
  }
  else res.status(400).send('Falta o intervalo de tempo (dataInicio e dataFim)...')
});


router.get('/minutenew/escolas/:codigo', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin_Municipio_Agrupamento(), function(req, res, next) {
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var niveis = req.query.niveis
  var tipos = req.query.tipos
  var escola = req.params.codigo
  if(dataInicio && dataFim){

    if(tipos && Array.isArray(tipos)) {
      var aux = ''
      for(var i = 0; i < tipos.length; i++) aux += tipos[i]
      tipos = aux
    }
    if(niveis && !Array.isArray(niveis)) niveis = niveis.split(",")

    if(tipos && niveis){
      Calculus.getTiposNiveisMinuteNewProfessores(escola, dataInicio, dataFim, niveis, tipos)
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro))
    }
    else if(tipos){
      Calculus.getTiposMinuteNewProfessores(escola, dataInicio, dataFim, tipos)
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro)) 
    }
    else if(niveis){
      Calculus.getNiveisMinuteNewProfessores(escola, dataInicio, dataFim, niveis)
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro)) 
    }
    else{
      Calculus.getTodosMinuteNewProfessores(escola, dataInicio, dataFim)
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro))
    }
  }
  else res.status(400).send('Falta o intervalo de tempo (dataInicio e dataFim)...')
});

// Devolve estatisticas globais sobre os professores da escola
router.get('/:jogo/escolas/:codigo', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin_Municipio_Agrupamento(), function(req, res){
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var jogoTipo = req.query.jogoTipo
  var jogoTable = req.params.jogo
  var escola = req.params.codigo
  if(dataInicio && dataFim){
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
  }
  else res.status(400).send('Falta o intervalo de tempo (dataInicio e dataFim)...')
})

// Calcrapid por aluno de uma turma
router.get('/calcrapid/turmas/:turma', passport.authenticate('jwt', {session: false}), verifyToken.verifyTurma3(), function(req, res, next) {
  var tipo = req.query.tipo
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var turma = req.params.turma
  var escola = req.query.escola
  var horaInicio = req.query.horaInicio
  var horaFim = req.query.horaFim
  if(dataInicio && dataFim && escola && horaInicio && horaFim){
    if(tipo && tipo.length > 0){
      var tipoParsed = tipo
      if(!Array.isArray(tipo)) tipoParsed = tipo.split(',')
      Calcrapid.getTiposCalcRapidTurmas(dataInicio, dataFim, tipoParsed, escola, turma, horaInicio, horaFim)
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro))
    }
    else{
      Calcrapid.getTodosCalcRapidTurmas(dataInicio, dataFim, escola, turma, horaInicio, horaFim)
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro))
    }
  }
  else res.status(400).send('Faltam parâmetros...')
});

router.get('/minutenew/turmas/:turma', passport.authenticate('jwt', {session: false}), verifyToken.verifyTurma3(), function(req, res, next) {
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var niveis = req.query.niveis
  var tipos = req.query.tipos
  var turma = req.params.turma
  var escola = req.query.escola
  var horaInicio = req.query.horaInicio
  var horaFim = req.query.horaFim
  if(dataInicio && dataFim && escola && horaInicio && horaFim){
    if(tipos && Array.isArray(tipos)) {
      var aux = ''
      for(var i = 0; i < tipos.length; i++) aux += tipos[i]
      tipos = aux
    }
    if(niveis && !Array.isArray(niveis)) niveis = niveis.split(",")

    if(tipos && niveis){
      Calculus.getTiposNiveisMinuteNewTurma(turma, escola, dataInicio, dataFim, niveis, tipos, horaInicio, horaFim)
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro))
    }
    else if(tipos){
      Calculus.getTiposMinuteNewTurma(turma, escola, dataInicio, dataFim, tipos, horaInicio, horaFim)
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro)) 
    }
    else if(niveis){
      Calculus.getNiveisMinuteNewTurma(turma, escola, dataInicio, dataFim, niveis, horaInicio, horaFim)
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro)) 
    }
    else{
      Calculus.getTodosMinuteNewTurma(turma, escola, dataInicio, dataFim, horaInicio, horaFim)
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro))
    }
  }
  else res.status(400).send('Faltam parâmetros...')
});

// Devolve todos as estatísticas de um jogo de uma turma
router.get('/:jogo/turmas/:turma', passport.authenticate('jwt', {session: false}), verifyToken.verifyTurma3(),  function(req, res){
  var turma = req.params.turma
  var tableJogo = req.params.jogo
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var jogoTipo = req.query.jogoTipo
  var escola = req.query.escola
  var horaInicio = req.query.horaInicio
  var horaFim = req.query.horaFim
  if(dataInicio && dataFim && escola && horaInicio && horaFim){
    if(tableJogo != "Todos"){
      JogosGerais.getJogoFromTurma(dataInicio, dataFim, jogoTipo, tableJogo, turma, escola, horaInicio, horaFim)
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro))
    }
    else{
      Jogos.getAllJogosTurma(dataInicio, dataFim, turma, escola, horaInicio, horaFim)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).jsonp(erro))
    }
  }
  else res.status(400).send('Faltam parâmetros...')
})

router.get('/calcrapid/turmas/:turma/ranking', passport.authenticate('jwt', {session: false}), verifyToken.verifyTurma3(), function(req, res, next) {
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
        var tipoParsed = tipo
        if(!Array.isArray(tipo)) tipoParsed = tipo.split(',')
        Rankings.calculaRankingTurmaCalcRapidTipos(turma, escola, codprofessor, dataInicio, dataFim, tipoParsed)
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


router.get('/minutenew/turmas/:turma/ranking', passport.authenticate('jwt', {session: false}), verifyToken.verifyTurma3(), function(req, res, next) {
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

      if(tipos && Array.isArray(tipos)) {
        var aux = ''
        for(var i = 0; i < tipos.length; i++) aux += tipos[i]
        tipos = aux
      }
      if(niveis && !Array.isArray(niveis)) niveis = niveis.split(",")

      if(tipos && niveis){
        Rankings.calculaRankingTurmaMinuteNewNiveisTipos(turma, escola, codprofessor, dataInicio, dataFim, niveis, tipos)
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
        Rankings.calculaRankingTurmaMinuteNewNiveis(turma, escola, codprofessor, dataInicio, dataFim, niveis)
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


router.get('/:jogo/turmas/:turma/ranking', passport.authenticate('jwt', {session: false}), verifyToken.verifyTurma3(), function(req, res, next) {
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

router.get('/:jogo/turmas/:turma/intervalos', passport.authenticate('jwt', {session: false}), verifyToken.verifyTurma3(), function(req, res, next) {
  var turma = req.params.turma
  var escola = req.query.escola
  var jogo = req.params.jogo 
  var jogoTipo = req.query.jogoTipo
  if(turma && escola && jogo && jogoTipo){
      JogosGerais.getEstatisticasGraficoTurma(jogoTipo, jogo, turma, escola)
                 .then(dados => res.jsonp(dados))
                 .catch(error => { console.log(error); res.status(500).jsonp("Error")})
  }
  else res.status(400).jsonp("Faltam parâmetros.")
});

router.get('/alunos/:user/last10', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin_Professor_Aluno2(), function(req, res, next) {
  var user = req.params.user
  Jogos.getLast10FromAluno(user)
        .then(dados => res.jsonp(dados))
        .catch(error => { console.log(error); res.status(500).jsonp("Error")})
});

router.get('/alunos/:user/jogou', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin_Professor_Aluno2(), function(req, res, next) {
  var user = req.params.user
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  if(dataInicio && dataFim){
    Jogos.getJogosFromAluno(user, dataInicio, dataFim)
          .then(dados => res.jsonp(dados))
          .catch(error => { console.log(error); res.status(500).jsonp("Error")})
  }
  else res.status(400).jsonp("Faltam parâmetros (dataInicio ou dataFim).")
});

router.get('/alunos/:user/frequencia', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin_Professor_Aluno2(), function(req, res, next) {
  var user = req.params.user
 
  Jogos.getFrequenciaTotalAluno(user)
        .then(dados => res.jsonp(dados))
        .catch(error => { console.log(error); res.status(500).jsonp("Error")})
});

router.get('/calcrapid/alunos/:user', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin_Professor_Aluno2(), function(req, res, next) {
  var user = req.params.user
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var tipos = req.query.tipos

  if(dataInicio && dataFim){
      if(tipos){
        Calcrapid.getTiposCalcRapidAluno(dataInicio, dataFim, tipos.split(','), user)
                 .then(dados => res.jsonp(dados))
                 .catch(error => { console.log(error); res.status(500).jsonp("Error")})
      }
      else{
        Calcrapid.getTodosCalcRapidAluno(dataInicio, dataFim, user)
                 .then(dados => res.jsonp(dados))
                 .catch(error => { console.log(error); res.status(500).jsonp("Error")})
      }
  }
  else res.status(400).jsonp("Faltam parâmetros.")
});

router.get('/minutenew/alunos/:user', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin_Professor_Aluno2(), function(req, res, next) {
  var user = req.params.user
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var tipos = req.query.tipos
  var niveis = req.query.niveis

  if(tipos && niveis){
    Calculus.getTiposNiveisMinuteNewAluno(user, dataInicio, dataFim, niveis.split(","), tipos)
              .then(dados => res.jsonp(dados))
              .catch(erro => res.status(500).jsonp(erro))
  }
  else if(tipos){
    Calculus.getTiposMinuteNewAluno(user, dataInicio, dataFim, tipos)
              .then(dados => res.jsonp(dados))
              .catch(erro => res.status(500).jsonp(erro)) 
  }
  else if(niveis){
    Calculus.getNiveisMinuteNewAluno(user, dataInicio, dataFim, niveis.split(","))
              .then(dados => res.jsonp(dados))
              .catch(erro => res.status(500).jsonp(erro)) 
  }
  else{
    Calculus.getTodosMinuteNewAluno(user, dataInicio, dataFim)
              .then(dados => res.jsonp(dados))
              .catch(erro => res.status(500).jsonp(erro))
  }
});

router.get('/minutenew/alunos/:user/dias', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin_Professor_Aluno2(), function(req, res, next) {
  var user = req.params.user
  Calculus.alunoPorDia(user)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).jsonp(erro))
  
});

router.get('/:jogo/alunos/:user/dias', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin_Professor_Aluno2(), function(req, res, next) {
  var user = req.params.user
  var jogo = req.params.jogo
  var tipo = req.query.tipo
  if(jogo && tipo){
    JogosGerais.getJogoPorDia(user, jogo, tipo)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).jsonp(erro))
  }
  else res.status(400).jsonp("Faltam parâmetros (jogo ou tipo)")
});



module.exports = router