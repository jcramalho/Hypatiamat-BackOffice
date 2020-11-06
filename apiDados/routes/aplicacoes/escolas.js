var express = require('express');
var router = express.Router();

var Alunos = require('../../controllers/db_aplicacoes/alunos')
var Professores = require('../../controllers/db_aplicacoes/professor')
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
router.get('/:id', function(req, res, next) {
    Escolas.getEscola(req.params.id)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
  });

// Todas as escolas de um país
router.get('/paises/:pais', function(req, res, next) {
    Escolas.getEscolasByPais(req.params.pais)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
  });

// Todas as escolas de um distrito
router.get('/distritos/:distrito', function(req, res, next) {
    Escolas.getEscolasByDistrito(req.params.distrito)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
  });

  // Todas as escolas de uma localidade
router.get('/localidades/:localidade', function(req, res, next) {
    Escolas.getEscolasByLocalidade(req.params.localidade)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
  });

// Devolve todos os alunos de uma determinada escola
router.get('/:id/alunos', function(req, res){
    Alunos.getAlunosFromEscola(req.params.id)
               .then(alunosAtuais =>{
                res.jsonp(alunosAtuais)
               })
               .catch(erro => res.status(500).jsonp(erro))
})

// Devolve todos os professores de uma determinada escola
router.get('/:id/professores', function(req, res){
    Professores.getProfessoresByEscola(req.params.id)
               .then(alunosAtuais =>{
                res.jsonp(alunosAtuais)
               })
               .catch(erro => res.status(500).jsonp(erro))
})

//Insere uma nova escola
router.post('/', function(req, res){
    Escolas.insertEscola(req.body)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
})


// Apaga uma determinado escola
router.delete('/:id', function(req, res){
    Escolas.deleteEscola(req.params.id)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
})




module.exports = router