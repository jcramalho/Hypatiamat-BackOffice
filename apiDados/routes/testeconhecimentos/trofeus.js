var express = require('express');
var router = express.Router();
var passport = require('passport')

const Trofeus = require('../../controllers/db_testeconhecimentos/trofeus');

// Todas os trofeus de uma aluno
router.get('/alunos/:user', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    Trofeus.getTrofeusFromUser(req.params.user)
               .then(dados => res.jsonp(dados))
               .catch(erro => res.status(500).jsonp(erro))
});


module.exports = router