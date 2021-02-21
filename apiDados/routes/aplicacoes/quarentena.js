var express = require('express');
var router = express.Router();
var passport = require('passport')

var Quarentena = require('../../controllers/db_aplicacoes/quarentena');
var verifyToken = require('../../config/verifyToken')


/* GET Todos os pedidos. */
router.get('/', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    Quarentena.getPedidos()
         .then(response =>{
             res.jsonp(response)
         }) 
         .catch(erro =>{
             console.log(erro)
             res.status(500).jsonp(erro)
         })
     
 });

 /* GET Pedido com determinado id. */
router.get('/:id', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    Quarentena.getPedido(req.params.id)
         .then(response =>{
             res.jsonp(response)
         }) 
         .catch(erro =>{
             console.log(erro)
             res.status(500).jsonp(erro)
         })
     
 });



/* POST Inserção de um pedido de inscrição. */
router.post('/', function(req, res, next) {
   Quarentena.insertPedido(req.body)
        .then(response =>{
            res.jsonp(response)
        }) 
        .catch(erro =>{
            console.log(erro)
            res.status(500).jsonp(erro)
        })
    
});

/* POST Pedido aceite e inserção de um professor. */
router.post('/:id', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    Quarentena.aceitaPedido(req.params.id)
         .then(response =>{
             res.jsonp(response)
         }) 
         .catch(erro =>{
             console.log(erro)
             res.status(500).jsonp(erro)
         })
     
 });

/* DELETE Remoção de um pedido de inscrição. */
router.delete('/:id', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    Quarentena.deletePedido(req.params.id)
         .then(response =>{
             res.jsonp(response)
         }) 
         .catch(erro =>{
             console.log(erro)
             res.status(500).jsonp(erro)
         })
     
 });

module.exports = router