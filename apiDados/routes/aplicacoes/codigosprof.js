var express = require('express');
var router = express.Router();
var passport = require('passport')

var Codigos = require('../../controllers/db_aplicacoes/codigosprof')
var verifyToken = require('../../config/verifyToken')


router.get('/', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    Codigos.getCodigos()
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});


router.get('/:id', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    Codigos.getCodigos(req.params.id)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

router.post('/', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    Codigos.insertCodigo(req.body)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

router.post('/lista', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), async function(req, res, next) {
    var codigos = req.body.codigos;
    var inseridos = 0
    for(var i = 0; i < codigos.length; i++){
      await Codigos.insertCodigo(codigos[i])
                  .catch(erro =>{ console.log(erro) ; res.status(500).jsonp('Erro')})
    }
    res.jsonp('Foram inseridos ' + codigos.length + ' códigos.')
});

router.delete('/:id', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    Codigos.deleteCodigo(req.params.id)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});


module.exports = router