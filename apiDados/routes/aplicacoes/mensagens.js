var express = require('express');
var router = express.Router();
var passport = require('passport')

var Mensagens = require('../../controllers/db_aplicacoes/mensagens')
var verifyToken = require('../../config/verifyToken')

router.get('/:idMensagem/vistos', passport.authenticate('jwt', {session: false}), verifyToken.verifyProfessor3(), function(req, res, next) {
    Mensagens.getQuemViuMensagem(req.params.idMensagem)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).jsonp(erro))
});

router.get('/professores/:codigo', passport.authenticate('jwt', {session: false}), verifyToken.verifyProfessor(), function(req, res, next) {
    Mensagens.getMensagensFromProfessor(req.params.codigo)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).jsonp(erro))
});

router.get('/alunos/:user', passport.authenticate('jwt', {session: false}), verifyToken.verifyAluno3(), function(req, res, next) {
    Mensagens.getMensagensFromAluno(req.params.user)
             .then(dados => res.jsonp(dados))
             .catch(erro => res.status(500).jsonp(erro))
});

router.get('/alunos/:user/recentes', passport.authenticate('jwt', {session: false}), verifyToken.verifyAluno3(), function(req, res, next) {
    Mensagens.getMensagensFromAlunoRecentes(req.params.user)
             .then(dados => res.jsonp(dados))
             .catch(erro => res.status(500).jsonp(erro))
});

router.get('/alunos/:user/antigas', passport.authenticate('jwt', {session: false}), verifyToken.verifyAluno3(), function(req, res, next) {
    Mensagens.getMensagensFromAlunoAntigas(req.params.user)
             .then(dados => res.jsonp(dados))
             .catch(erro => res.status(500).jsonp(erro))
});


router.get('/alunos/:user/number/naovistas', passport.authenticate('jwt', {session: false}), verifyToken.verifyAluno3(), function(req, res, next) {
    Mensagens.countMensagensFromAlunoNaoVistas(req.params.user)
             .then(dados => {console.log(dados); res.jsonp(dados)})
             .catch(erro => res.status(500).jsonp(erro))
});

router.post('/', passport.authenticate('jwt', {session: false}), verifyToken.verifyProfessor2(), function(req, res, next) {
    var mensagem = req.body
    if(mensagem.alunos.length > 0 && mensagem.text && mensagem.codprofessor){
        Mensagens.enviaMensagem(mensagem) 
                 .then(dados => res.jsonp(dados))
                 .catch(erro => res.status(500).jsonp(erro))
    }
    else res.status(400).send('Faltam parâmetros.')
    
});

router.put('/:id/vista', passport.authenticate('jwt', {session: false}), verifyToken.verifyAluno4(), function(req, res, next) {
    var id = req.params.id
    Mensagens.putMensagemVista(id) 
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro))
    
});



module.exports = router