var express = require('express');
var router = express.Router();
var passport = require('passport')
const anoletivoAtual = require('../../config/confs').anoletivo

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

router.get('/localidades', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    Escolas.getMunicipios()
           .then(dados =>res.jsonp(dados))
           .catch(erro => res.status(500).jsonp(erro))
});

// Informação de uma escola
router.get('/:codigo', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin_Municipio_Agrupamento(), function(req, res, next) {
    Escolas.getEscola(req.params.codigo)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
  });

// Devolve todos os alunos de uma determinada escola
router.get('/:codigo/alunos', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin_Municipio_Agrupamento(), function(req, res){
  Alunos.getAlunosFromEscola(req.params.codigo)
             .then(alunosAtuais =>{
              res.jsonp(alunosAtuais)
             })
             .catch(erro => res.status(500).jsonp(erro))
})

// Devolve todos os professores de uma determinada escola
router.get('/:codigo/professores', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin_Municipio_Agrupamento(), function(req, res){
  Professores.getProfessoresByEscola(req.params.codigo)
             .then(alunosAtuais =>{
              res.jsonp(alunosAtuais)
             })
             .catch(erro => res.status(500).jsonp(erro))
})

// Devolve todos as turmas de uma determinada escola (pode eventualmente escolher o ano das turmas a pesquisar)
router.get('/:codigo/turmas', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin_Municipio_Agrupamento(), function(req, res){
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
  var comunidade = req.query.comunidade
  
  var anosescolaridade = req.query.anosescolaridade
  if(anosescolaridade && !Array.isArray(anosescolaridade)) anosescolaridade = anosescolaridade.split(",")

  if(ano) var anoletivo = ano + "/" + ((parseInt(ano) + 1))
  else var anoletivo = anoletivoAtual

  if(comunidade){
    Estatisticas.getEstatisticasComunidade(anoletivo, comunidade, anosescolaridade)
                .then(dados =>res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro))
  }
  else{
    Estatisticas.getEstatisticasMunicipios(anoletivo, anosescolaridade)
                .then(dados =>res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro))
  }
});

// Devolve estatisticas globais sobre a escola
router.get('/:codigo/estatisticas', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin_Municipio_Agrupamento(), function(req, res){
  var escola = req.params.codigo
  var ano = req.query.ano

  var anosescolaridade = req.query.anosescolaridade
  if(anosescolaridade && !Array.isArray(anosescolaridade)) anosescolaridade = anosescolaridade.split(",")

  if(ano) var anoletivo = ano + "/" + ((parseInt(ano) + 1))
  else var anoletivo = anoletivoAtual

  Estatisticas.getEstatisticasAgrupamentoAno(escola, anoletivo, anosescolaridade)
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

  var anosescolaridade = req.query.anosescolaridade
  if(anosescolaridade && !Array.isArray(anosescolaridade)) anosescolaridade = anosescolaridade.split(",")

  var agrupamentos = req.query.agrupamentos
  if(!agrupamentos){
    Estatisticas.getEstatisticasMunicipioAno(req.params.municipio, anoletivo, anosescolaridade)
              .then(dados =>{
                res.jsonp(dados)
              })
              .catch(erro => res.status(500).jsonp(erro))
  }
  else{
    Estatisticas.getEstatisticaAgruMun(req.params.municipio, anoletivo, anosescolaridade)
                .then(dados =>{
                  res.jsonp(dados)
                })
                .catch(erro => res.status(500).jsonp(erro))
  }
});

router.get('/:codigo/estatisticas/professores', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin_Municipio_Agrupamento(), function(req, res){
  var ano = req.query.ano
  if(ano) var anoletivo = ano + "/" + ((parseInt(ano) + 1))
  else var anoletivo = anoletivoAtual

  var anosescolaridade = req.query.anosescolaridade
  if(anosescolaridade && !Array.isArray(anosescolaridade)) anosescolaridade = anosescolaridade.split(",")

  var escola = req.params.codigo;
  Estatisticas.getEstatisticaAnoAgruProf(escola, anoletivo, anosescolaridade)
              .then(dados => res.jsonp(dados))
              .catch(erro => res.status(500).jsonp("Error"))

})
  
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