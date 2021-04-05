var express = require('express');
var router = express.Router();
var passport = require('passport')

const Cromos = require('../../controllers/db_testeconhecimentos/cromos');
const CromosAlunos = require('../../controllers/db_testeconhecimentos/cromos_alunos');
const verifyToken = require('../../config/verifyToken')


router.get('/', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    Cromos.getCromosDB()
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).jsonp('Erro'))
});

router.get('/alunos/:user', passport.authenticate('jwt', {session: false}), verifyToken.verifyAluno() ,function(req, res, next) {
    CromosAlunos.getCromosFromUser(req.params.user)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).jsonp('Erro'))
});

router.get('/novos/alunos/:user', passport.authenticate('jwt', {session: false}), verifyToken.verifyAluno(), function(req, res, next) {
    //Cromos.getCromosAppsFromAluno(req.params.user)
    Cromos.getNovosCromos(req.params.user)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).jsonp('Erro'))
});

router.put('/:id/aberto', passport.authenticate('jwt', {session: false}), verifyToken.verifyAluno2(), function(req, res, next){
    CromosAlunos.updateCromoAberto(req.params.id)
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).send('Erro'))
})

module.exports = router