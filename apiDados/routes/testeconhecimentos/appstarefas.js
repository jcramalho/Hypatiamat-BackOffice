var express = require('express');
var router = express.Router();
var passport = require('passport')

var AppsTarefas = require('../../controllers/db_testeconhecimentos/appstarefas');

router.get('/', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    AppsTarefas.getApps()
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => {console.log(erro); res.status(500).send('Erro')})
});

router.get('/alunos/:user', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var dataInicio = req.query.dataInicio;
    var dataFim = req.query.dataFim;
    var table = req.query.table;
    var user = req.params.user
    if(dataInicio && dataFim && table){
        AppsTarefas.getTarefasFromAluno(table, user, dataInicio, dataFim)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => {console.log(erro); res.status(500).send('Erro')})
    }
    else res.status(400).send('Faltam parâmetros...')
});

module.exports = router