var express = require('express');
var router = express.Router();
var passport = require('passport')

var Quarentena = require('../../controllers/db_aplicacoes/quarentena');
var Escolas = require('../../controllers/db_aplicacoes/escolas');
var verifyToken = require('../../config/verifyToken')


/* GET Todos os pedidos. */
router.get('/', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    Quarentena.getPedidos()
         .then(response => res.jsonp(response)) 
         .catch(erro => res.status(500).jsonp('Error'))
     
 });

 /* GET Pedido com determinado id. */
router.get('/:id', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    Quarentena.getPedido(req.params.id)
         .then(response => res.jsonp(response)) 
         .catch(erro =>{
             console.log(erro)
             res.status(500).jsonp('Error')
         })
     
 });



/* POST Inserção de um pedido de inscrição. */
router.post('/', async function(req, res, next) {
   var pedido = req.body
   if(pedido.codigo && pedido.nome && pedido.escola && pedido.email && pedido.password){
    var escola = await Escolas.getEscola(pedido.escola)
    if(escola){
        Quarentena.insertPedido(pedido)
                .then(response => res.jsonp(response)) 
                .catch(erro =>{
                    console.log(erro)
                    res.status(500).jsonp('Error')
                })
    }
    else res.status(400).send('Código de escola inexistente.')
   }
   else res.status(400).send('Faltam parâmetros.')
});

/* POST Pedido aceite e inserção de um professor. */
router.post('/:id', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    Quarentena.aceitaPedido(req.params.id)
         .then(response => res.jsonp(response)) 
         .catch(erro =>{
             console.log(erro)
             res.status(500).jsonp('Error')
         })
     
 });

/* DELETE Remoção de um pedido de inscrição. */
router.delete('/:id', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    Quarentena.deletePedido(req.params.id)
         .then(response => res.jsonp(response)) 
         .catch(erro =>{
             console.log(erro)
             res.status(500).jsonp('Error')
         })
     
 });

module.exports = router