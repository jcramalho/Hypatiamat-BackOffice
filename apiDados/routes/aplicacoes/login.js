var express = require('express');
var router = express.Router();

var Login = require('../../config/login');


/* POST Autenticação de um professor ou aluno. */
router.post('/', function(req, res, next) {
   Login.login(req.body.user, req.body.password)
        .then(response =>{
            res.jsonp(response)
        }) 
        .catch(erro =>{
            console.log(erro)
            res.status(500).jsonp(erro)
        })
    
});

module.exports = router