var express = require('express');
var router = express.Router();
var passport = require('passport')

var Comunidades = require('../../controllers/db_aplicacoes/comunidades')
var verifyToken = require('../../config/verifyToken')


router.get('/', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    Comunidades.getComunidades()
               .then(dados => res.jsonp(dados))
               .catch(erro => res.status(500).jsonp(erro))
});


router.get('/:codigo', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    Comunidades.getMunicipiosFromComunidade(req.params.codigo)
               .then(dados => res.jsonp(dados))
               .catch(erro => res.status(500).jsonp(erro))
});

router.post('/', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), async function(req, res, next) {
    var municipios = await Comunidades.getMunicipiosFromComunidade(req.body.codigo)
    if(municipios.length == 0){
        Comunidades.criarComunidade(req.body.codigo, req.body.nome, req.body.municipios)
               .then(dados => res.jsonp(dados) )
               .catch(erro => res.status(500).jsonp(erro))
    }
    else{
        res.jsonp({message: 'Comunidade já existente.'})
    }
});

router.post('/:codigo', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), async function(req, res, next) {
    var codigo = req.params.codigo;
    var nome = req.body.nome
    var municipios = req.body.municipios
    var inseridos = 0;
    for(var i = 0; i < municipios.length; i++){
        var comunidadeMunicipio = await Comunidades.getMunicipioComunidade(codigo, municipios[i])
                                                   .catch(error => console.log(error))
        if(!comunidadeMunicipio){
            await Comunidades.insertComunidadeMunicipio(codigo, nome, municipios[i])
                             .catch(error => console.log(error))
            inseridos++
        }
    }
    res.jsonp({message: 'Foram inseridos ' + inseridos + " municípios à comunidade."})
});

router.delete('/:codigo', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), async function(req, res, next) {
    var codigo = req.params.codigo
    Comunidades.apagarComunidade(codigo)
               .then(dados => res.jsonp(dados))
               .catch(error => {console.log(error); res.status(500).send('Error')})
});

router.delete('/:codigo/municipios/:municipio', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), async function(req, res, next) {
    var codigo = req.params.codigo
    var municipio = req.params.municipio;
    Comunidades.deleteComunidadeMunicipio(codigo, municipio)
               .then(dados => res.jsonp(dados))
               .catch(error => {console.log(error); res.status(500).send('Error')})
});


module.exports = router