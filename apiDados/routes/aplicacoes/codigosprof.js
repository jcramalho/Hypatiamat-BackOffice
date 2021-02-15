var express = require('express');
var router = express.Router();
var passport = require('passport')

var Codigos = require('../../controllers/db_aplicacoes/codigosprof')

router.get('/', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    Codigos.getCodigos()
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});


router.get('/:id', passport.authenticate('jwt', {session: false}),function(req, res, next) {
    Codigos.getCodigos(req.params.id)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

router.post('/', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    Codigos.insertCodigo(req.body)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

router.delete('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    Codigos.deleteCodigo(req.params.id)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});


module.exports = router