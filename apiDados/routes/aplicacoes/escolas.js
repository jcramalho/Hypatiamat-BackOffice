var express = require('express');
var router = express.Router();
var passport = require('passport')
var anoletivoAtual = "20/21"

var Alunos = require('../../controllers/db_aplicacoes/alunos')
var Professores = require('../../controllers/db_aplicacoes/professor')
var Turmas = require('../../controllers/db_aplicacoes/turmas')
var Escolas = require('../../controllers/db_aplicacoes/escolas')
var Estatisticas = require('../../controllers/db_aplicacoes/estatisticas');
const Escola = require('../../controllers/db_aplicacoes/escolas');
const Estatistica = require('../../controllers/db_aplicacoes/estatisticas');

var verifyToken = require('../../config/verifyToken')


// Todas as escolas
router.get('/', function(req, res, next) {
    Escolas.getEscolas()
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
  });

// Informação de uma escola
router.get('/:codigo', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    Escolas.getEscola(req.params.codigo)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
  });

// Devolve todos os alunos de uma determinada escola
router.get('/:codigo/alunos', passport.authenticate('jwt', {session: false}), function(req, res){
  Alunos.getAlunosFromEscola(req.params.codigo)
             .then(alunosAtuais =>{
              res.jsonp(alunosAtuais)
             })
             .catch(erro => res.status(500).jsonp(erro))
})

// Devolve todos os professores de uma determinada escola
router.get('/:codigo/professores', passport.authenticate('jwt', {session: false}), function(req, res){
  Professores.getProfessoresByEscola(req.params.codigo)
             .then(alunosAtuais =>{
              res.jsonp(alunosAtuais)
             })
             .catch(erro => res.status(500).jsonp(erro))
})

// Devolve todos as turmas de uma determinada escola (pode eventualmente escolher o ano das turmas a pesquisar)
router.get('/:codigo/turmas', passport.authenticate('jwt', {session: false}), function(req, res){
  var ano = req.query.ano
  if(ano){
    var anoletivo = ano + "/" + (parseInt(ano) + 1)
    Professores.getTurmasFromEscolaAno(req.params.codigo, anoletivo)
              .then(turmas =>{
                res.jsonp(turmas)
              })
              .catch(erro => res.status(500).jsonp(erro))
  }
  else{
    Professores.getTurmasFromEscola(req.params.codigo)
              .then(turmas =>{
                res.jsonp(turmas)
              })
              .catch(erro => res.status(500).jsonp(erro))
  }
})

// As estatisticas gerais por cada municipio disponível
router.get('/localidades/estatisticas', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
  var ano = req.query.ano
  if(ano){
    var anoletivo = ano + "/" + ((parseInt(ano) + 1))
  }
  else{
    var anoletivo = anoletivoAtual
  }
  Estatisticas.getEstatisticasMunicipios(anoletivo)
              .then(dados =>{
                res.jsonp(dados)
              })
              .catch(erro => res.status(500).jsonp(erro))
});

// Devolve estatisticas globais sobre a escola
router.get('/:codigo/estatisticas', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin_Municipio_Agrupamento(), function(req, res){
  var escola = req.params.codigo
  var ano = req.query.ano

  if(ano) var anoletivo = ano + "/" + ((parseInt(ano) + 1))
  else var anoletivo = anoletivoAtual
  Estatisticas.getEstatisticasAgrupamentoAno(escola, anoletivo)
             .then(estatisticas =>{
              res.jsonp(estatisticas)
             })
             .catch(erro => res.status(500).jsonp(erro))
})

// Todas as escolas de um país
router.get('/paises/:pais', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    Escolas.getEscolasByPais(req.params.pais)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
  });

// Todas as escolas de um distrito
router.get('/distritos/:distrito', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    Escolas.getEscolasByDistrito(req.params.distrito)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
  });




  // Todas as escolas de uma localidade
router.get('/localidades/:municipio', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdminEMunicipio(), function(req, res, next) {
    Escolas.getEscolasByLocalidade(req.params.municipio)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
  });

  // Estatisticas globais de uma localidade (por agrupamento ou totalidade)
router.get('/localidades/:municipio/estatisticas',passport.authenticate('jwt', {session: false}), verifyToken.verifyAdminEMunicipio(), function(req, res, next) {
  var ano = req.query.ano
  if(ano) var anoletivo = ano + "/" + ((parseInt(ano) + 1))
  else var anoletivo = anoletivoAtual

  var agrupamentos = req.query.agrupamentos
  if(!agrupamentos){
    Estatisticas.getEstatisticasMunicipioAno(req.params.municipio, anoletivo)
              .then(dados =>{
                res.jsonp(dados)
              })
              .catch(erro => res.status(500).jsonp(erro))
  }
  else{
    Estatisticas.getEstatisticaAgruMun(req.params.municipio, anoletivo)
                .then(dados =>{
                  res.jsonp(dados)
                })
                .catch(erro => res.status(500).jsonp(erro))
  }
});

  // Pontuações de jogos por municipio
  router.get('/jogos/:jogo/municipios', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    var dataInicio = req.query.dataInicio
    var dataFim = req.query.dataFim
    var jogoTipo = req.query.jogoTipo
    var jogoTable = req.params.jogo
    if(jogoTable == "Todos"){
      Escolas.getAllJogosMunicipios(dataInicio, dataFim)
                .then(dados =>{
                  res.jsonp(dados)
                })
                .catch(erro => res.status(500).jsonp(erro))
    }
    else{
      Escolas.getJogosMunicipio(jogoTable, jogoTipo, dataInicio, dataFim)
                .then(dados =>{
                  res.jsonp(dados)
                })
                .catch(erro => res.status(500).jsonp(erro))
    }
  });

  // Devolve estatisticas globais sobre os professores da escola
router.get('/:codigo/jogos/professores', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin_Municipio_Agrupamento(), function(req, res){
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var jogoTipo = req.query.jogoTipo
  var jogoTable = req.query.jogoTable
  var escola = req.params.codigo
  if(jogoTable){
    Escolas.getJogosProfessores(jogoTable, jogoTipo, dataInicio, dataFim, escola)
        .then(turmas =>{
          res.jsonp(turmas)
        })
        .catch(erro => res.status(500).jsonp(erro))
  }
  else{
    Escolas.getAllJogosProfessores(dataInicio, dataFim, escola)
          .then(turmas =>{
            res.jsonp(turmas)
          })
          .catch(erro => res.status(500).jsonp(erro))
  }
})

router.get('/:codigo/estatisticas/professores', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin_Municipio_Agrupamento(), function(req, res){
  var ano = req.query.ano
  if(ano) var anoletivo = ano + "/" + ((parseInt(ano) + 1))
  else var anoletivo = anoletivoAtual
  var escola = req.params.codigo;
  Estatisticas.getEstatisticaAnoAgruProf(escola, anoletivo)
              .then(dados => res.jsonp(dados))
              .catch(erro => res.status(500).jsonp("Error"))

})

// Pontuações de jogos por escola de um municipio
router.get('/jogos/:jogo/municipios/:municipio', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdminEMunicipio(), function(req, res, next) {
  var dataInicio = req.query.dataInicio
  var dataFim = req.query.dataFim
  var jogoTipo = req.query.jogoTipo
  var jogoTable = req.params.jogo
  var municipio = req.params.municipio
  if(jogoTable == 'Todos'){
    Escolas.getAllJogosEscolas(dataInicio, dataFim, municipio)
            .then(dados =>{
              res.jsonp(dados)
            })
            .catch(erro => res.status(500).jsonp(erro))
  }
  else{
    Escolas.getJogosEscolas(jogoTable, jogoTipo, dataInicio, dataFim, municipio)
                .then(dados =>{
                  res.jsonp(dados)
                })
                .catch(erro => res.status(500).jsonp(erro))
  }
});
  
// Altera uma escola
router.put('/:codigo', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res){
  Escolas.updateEscola(req.params.codigo, req.body)
             .then(dados =>{
               res.jsonp(dados)
             })
             .catch(erro => res.status(500).jsonp(erro))
})



//Insere uma nova escola
router.post('/', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res){
    Escolas.insertEscola(req.body)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
})


// Apaga uma determinado escola
router.delete('/:codigo', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res){
    Escolas.apagar(req.params.codigo)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
})




module.exports = router