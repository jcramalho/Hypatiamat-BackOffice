var express = require('express');
var router = express.Router();
var passport = require('passport')

var Alunos = require('../../controllers/db_aplicacoes/alunos')
var Turmas = require('../../controllers/db_aplicacoes/turmas')
var TurmasOld = require('../../controllers/db_aplicacoes/turmasold')
var verifyToken = require('../../config/verifyToken');
const { getAllJogosMunicipios } = require('../../controllers/db_aplicacoes/escolas');
var anoAtual = "21"

// Todas as turmas
router.get('/', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    Turmas.getTurmas()
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
  });


// Todas as turmas de um determinado ano letivo (ano = 20) => (anoletivo = 20/21)
router.get('/anos/:ano', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
  var anoletivo = req.params.ano + "/" + (parseInt(req.params.ano) + 1)
  
  Turmas.getTurmasFromAnoLetivo(anoletivo)
             .then(dados =>{
               res.jsonp(dados)
             })
             .catch(erro => res.status(500).jsonp(erro))
});

// Informação de uma turma
router.get('/:id', passport.authenticate('jwt', {session: false}), verifyToken.verifyTurma(), function(req, res, next) {
    Turmas.getTurmaById(req.params.id)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
  });

// Devolve todos os alunos de uma determinada turma
router.get('/:turma/alunos', passport.authenticate('jwt', {session: false}), verifyToken.verifyTurma2(), async function(req, res){
    var turma = req.params.turma
    var codprofessor = req.query.codprofessor
    var aux
    if(( aux = turma.split("-") )){
      if(req.query.codprofessor){
        if(aux[1] == anoAtual){
          Alunos.getAlunosFromTurma(turma, codprofessor)
                    .then(alunosAtuais =>{
                      res.jsonp(alunosAtuais)
                    })
                    .catch(erro => res.status(500).jsonp(erro))
        }
        else{
          var alunosAtuais = await Alunos.getAlunosFromTurma(turma, codprofessor);
          var alunosOld = await TurmasOld.getAlunosFromTurma(turma, codprofessor);
          for(var i = 0; i < alunosOld.length; i++){
            alunosOld[i].alunoOld = true
            alunosAtuais.push(alunosOld[i])
          }
          res.jsonp(alunosAtuais)
        }
      }
      else res.status(400).jsonp(erro)
    }
    else res.status(400).jsonp(erro)
})

// Devolve todos os jogos uma determinada turma jogou
router.get('/:turma/jogos', passport.authenticate('jwt', {session: false}), verifyToken.verifyTurma3(), function(req, res){
  var turma = req.params.turma
  var escola = req.query.escola
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  Turmas.getJogos(turma, escola, dataInicio, dataFim)
             .then(jogos =>{
              res.jsonp(jogos)
             })
             .catch(erro => res.status(500).jsonp(erro))
})


// Devolve todos as estatísticas de um jogo de uma turma
router.get('/:turma/jogos/:tableJogo', passport.authenticate('jwt', {session: false}), verifyToken.verifyTurma3(),  function(req, res){
  var turma = req.params.turma
  var tableJogo = req.params.tableJogo
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var jogoTipo = req.query.jogoTipo
  var escola = req.query.escola
  if(tableJogo != "Todos"){
    Turmas.getJogosFromTurma(dataInicio, dataFim, jogoTipo, tableJogo, turma, escola)
              .then(alunosAtuais =>{
                
                res.jsonp(alunosAtuais)
              })
              .catch(erro => res.status(500).jsonp(erro))
  }
  else{
    console.log(escola)
    Turmas.getAllJogosTurma(dataInicio, dataFim, turma, escola)
          .then(alunosAtuais =>{
                      
            res.jsonp(alunosAtuais)
          })
          .catch(erro => res.status(500).jsonp(erro))
  }
})

// Devolve todos os resultados de um jogo de uma turma
router.get('/:turma/jogos/:tableJogo/estatisticasGlobais',passport.authenticate('jwt', {session: false}), verifyToken.verifyTurma3(),  function(req, res){
  var turma = req.params.turma
  var tableJogo = req.params.tableJogo
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var jogoTipo = req.query.jogoTipo
  var escola = req.query.escola
  Turmas.getEstatisticasGlobais(dataInicio, dataFim, jogoTipo, tableJogo, turma, escola)
             .then(alunosAtuais =>{
              
              res.jsonp(alunosAtuais)
             })
             .catch(erro => res.status(500).jsonp(erro))
})

//Insere uma nova turma
router.post('/', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin_Professor2(), function(req, res){
    Turmas.insertTurma(req.body)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
})

//Altera uma turma
router.put('/:id', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res){
  Turmas.updateTurma(req.params.id, req.body)
             .then(dados =>{
               res.jsonp(dados)
             })
             .catch(erro => res.status(500).jsonp(erro))
})


// Apaga uma determinado turma
router.delete('/:turma', passport.authenticate('jwt', {session: false}), verifyToken.verifyTurma4(), function(req, res){
    Turmas.apagar(req.params.turma, req.query.codprofessor)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
})




module.exports = router