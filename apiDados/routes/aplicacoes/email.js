var express = require('express');
const { JsonWebTokenError } = require('jsonwebtoken');
var router = express.Router();
var passport = require('passport')

const Email = require('../../controllers/db_aplicacoes/email')


router.post('/enviar', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var destinatarios = req.body.destinatarios
    var texto = req.body.texto
    var nome = req.body.nome
    if(destinatarios && Array.isArray(destinatarios) && texto && nome){
        Email.sendEmail(nome, destinatarios, texto)
             .then(dados => res.jsonp(dados))
             .catch(erro => res.status(500).send('Erro'))
    }
    else res.status(400).send('Faltam parâmetros.')
});

router.post('/registo', function(req, res, next) {
    var user = req.body.user
    if(user.codigo && user.email && user.nome && user.escola){
        var text = 'Boas, \nUm novo professor registou-se na plataforma com as seguintes informações:\n\n'
        text += 'Código: ' + user.codigo + '\nNome: ' + user.nome + '\nEmail: ' + user.email + '\nAgr. Escolas: ' + user.escola
        text += '\n\nAceite ou rejeite o pedido de inscrição no escritório.'
        Email.sendEmailRegisto('Novo Professor Registado', text)
             .then(dados => res.jsonp(dados))
             .catch(erro => res.status(500).send('Erro'))
    }
    else res.status(400).send('Faltam parâmetros.')
})

module.exports = router