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

/* POST Autenticação de um professor visitante (demonstração). */
router.get('/professor/visitante', function(req, res, next) {
    Login.getTokenProfExperimental()
         .then(response =>{
             res.jsonp(response)
         }) 
         .catch(erro =>{
             console.log(erro)
             res.status(500).jsonp(erro)
         })
     
});

/* POST Autenticação de um aluno visitante (demonstração). */
router.get('/aluno/visitante', function(req, res, next) {
    Login.getTokenAlunoExperimental()
         .then(response =>{
             res.jsonp(response)
         }) 
         .catch(erro =>{
             console.log(erro)
             res.status(500).jsonp(erro)
         })
     
});

module.exports = router