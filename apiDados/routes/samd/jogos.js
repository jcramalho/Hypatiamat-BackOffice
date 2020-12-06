var express = require('express');
var router = express.Router();

var Jogos = require('../../controllers/db_samd/jogos');

// Todas os jogos
router.get('/', function(req, res, next) {
    Jogos.getJogos()
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});


module.exports = router