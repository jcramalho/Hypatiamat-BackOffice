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
               .then(dados =>{ if(dados) res.jsonp(dados) 
                                else res.status(400).send('Novidade inexistente.')})
               .catch(erro => res.status(500).jsonp(erro))
});


router.post('/', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    if(req.body.titulo){
        Novidades.insertNovidade(req.body)
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro))
    }
    else res.status(400).send("Tem que fornecer, pelo menos, um título para a novidade.")
});

router.post('/:id/subnovidade', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    if(req.body.subnovidade){
        Novidades.insertSubNovidade(req.params.id, req.body.subnovidade)
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro))
    }
    else res.status(400).send("Tem que fornecer a subnovidade associada.")
});

router.put('/:id', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    if(req.body.titulo){
        Novidades.updateNovidade(req.params.id, req.body)
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro))
    }
    else res.status(400).send("Tem que fornecer, pelo menos, um título para a novidade (igual, caso pretenda manter o mesmo título).")
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