var express = require('express');
var router = express.Router();
var passport = require('passport')
const verifyToken = require('../../config/verifyToken')
const Novidades = require('../../controllers/db_aplicacoes/novidades');

router.get('/', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    Novidades.getNovidades()
               .then(dados => res.jsonp(dados))
               .catch(erro => res.status(500).jsonp(erro))
});

router.get('/info', function(req, res, next) {
    Novidades.getAllInfoNovidades()
               .then(dados => res.jsonp(dados))
               .catch(erro => res.status(500).jsonp(erro))
});

router.get('/:id', function(req, res, next) {
    Novidades.getNovidade(req.params.id)
               .then(dados => res.jsonp(dados))
               .catch(erro => res.status(500).jsonp(erro))
});


router.post('/', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    Novidades.insertNovidade(req.body)
               .then(dados => res.jsonp(dados))
               .catch(erro => res.status(500).jsonp(erro))
});

router.post('/:id/subnovidade', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    Novidades.insertSubNovidade(req.params.id, req.body.subnovidade)
               .then(dados => res.jsonp(dados))
               .catch(erro => res.status(500).jsonp(erro))
});

router.put('/:id', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    Novidades.updateNovidade(req.params.id, req.body)
               .then(dados => res.jsonp(dados))
               .catch(erro => res.status(500).jsonp(erro))
});

router.delete('/:id', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    Novidades.apagaNovidade(req.params.id)
               .then(dados => res.jsonp(dados))
               .catch(erro => res.status(500).jsonp(erro))
});

router.delete('/subnovidades/:id', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    Novidades.apagaSubNovidade(req.params.id)
               .then(dados => res.jsonp(dados))
               .catch(erro => res.status(500).jsonp(erro))
});

module.exports = router