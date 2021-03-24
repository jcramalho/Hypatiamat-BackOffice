var express = require('express');
var router = express.Router();
var passport = require('passport')

var Codigos = require('../../controllers/db_aplicacoes/codigosprof')
var verifyToken = require('../../config/verifyToken')


router.get('/', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    Codigos.getCodigos()
               .then(dados =>res.jsonp(dados))
               .catch(erro => res.status(500).jsonp(erro))
});


router.get('/:id', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    Codigos.getCodigo(req.params.id)
               .then(dados =>res.jsonp(dados))
               .catch(erro => res.status(500).jsonp(erro))
});

router.post('/', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), async function(req, res, next) {
   if(req.body.codigo){
      var codigo = await Codigos.getCodigo2(req.body.codigo)
      if(!codigo){
        Codigos.insertCodigo(req.body)
                  .then(dados =>res.jsonp(dados))
                  .catch(erro => res.status(500).jsonp(erro))
      }
      else res.status(400).send('Código já existente.')
    }
    else res.status(400).send('Falta o código.')
});

router.post('/lista', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), async function(req, res, next) {
    var codigos = req.body.codigos;
    var inseridos = 0
    for(var i = 0; i < codigos.length; i++){
      var codigo = await Codigos.getCodigo2(codigos[i].codigo)
      if(!codigo){
        inseridos++;
        await Codigos.insertCodigo(codigos[i])
                     .catch(erro =>{ console.log(erro) ; res.status(500).jsonp('Erro')})
      }
    }
    res.jsonp('Foram inseridos ' + inseridos + ' códigos.')
});

router.delete('/:id', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    Codigos.deleteCodigo(req.params.id)
               .then(dados => res.jsonp(dados))
               .catch(erro => res.status(500).jsonp(erro))
});


module.exports = router