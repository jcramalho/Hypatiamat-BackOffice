var express = require('express');
var router = express.Router();
var passport = require('passport')
var multer = require('multer')
var fs = require('fs');
var upload = multer({dest: 'uploads/'})

const Cromos = require('../../controllers/db_testeconhecimentos/cromos');
const CromosAlunos = require('../../controllers/db_testeconhecimentos/cromos_alunos');
const verifyToken = require('../../config/verifyToken')
const root = __dirname + "/../../"
const pathImages = __dirname + "/../../public/cromos_imgs"


function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            var aux = name.split("/"[0])
            files_.push(aux[aux.length-2] + "/" + aux[aux.length-1] );
        }
    }
    return files_;
}

router.get('/', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var anoletivo = req.query.anoletivo
    if(anoletivo){
        Cromos.getCromosDB2(anoletivo)
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).jsonp('Erro'))
    }
    else{
        Cromos.getCromosDB()
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).jsonp('Erro'))
    }
});

router.get('/:id', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), async function(req, res, next) {
    Cromos.getCromo(req.params.id)
          .then(dados => res.jsonp(dados))
          .catch(erro => res.status(500).send('Erro.'))
});

router.get('/imagens/nome', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), async function(req, res, next) {
   var images = await getFiles(pathImages)
   res.jsonp(images)
});

router.get('/alunos/:user', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin_Professor_Aluno2() ,function(req, res, next) {
    CromosAlunos.getCromosFromUser(req.params.user)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).jsonp('Erro'))
});

router.get('/novos/alunos/:user', passport.authenticate('jwt', {session: false}), verifyToken.verifyAluno(), function(req, res, next) {
    //Cromos.getCromosAppsFromAluno(req.params.user)
    Cromos.getNovosCromos(req.params.user)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).jsonp('Erro'))
});

router.put('/:id/aberto', passport.authenticate('jwt', {session: false}), verifyToken.verifyAluno2(), function(req, res, next){
    CromosAlunos.updateCromoAberto(req.params.id)
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).send('Erro'))
})

router.put('/:id', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), async function(req, res, next) {
    var cromo = req.body
    var id = req.params.id

    if(cromo.numero && cromo.nome && cromo.descricao && cromo.imagem && cromo.anoletivo){
        Cromos.updateCromo(id, cromo)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).send('Erro'))
    }
    else res.status(400).send('Faltam parâmetros.')

})

router.post('/', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), async function(req, res, next) {
    var cromo = req.body

    if(cromo.numero && cromo.nome && cromo.descricao && cromo.imagem && cromo.anoletivo){
        Cromos.insertCromo(cromo)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).send('Erro'))
    }
    else res.status(400).send('Faltam parâmetros.')

})

router.post('/imagem', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), upload.single('file'), async function(req, res, next) {
    let file = req.file
    let nome = req.query.nome
    let pasta = req.query.pasta

    if(file && pasta && nome){
        let newPath = pathImages + "/" + pasta

        if (!fs.existsSync(newPath)){
            fs.mkdirSync(newPath);
        }

        let oldPath = root + file.path
        let newPathFile = newPath + "/" + nome

        fs.copyFile(oldPath, newPathFile, function(err){
            if(err) throw err
            
            fs.unlinkSync(oldPath);

            res.jsonp({message: 'Imagem inserida com sucesso.'})

        })
    }
    else res.status(400).send('Faltam parâmetros.')
})

router.delete('/:id', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), async function(req, res, next) {
    var id = req.params.id
    Cromos.apagarCromo(id)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro'))

})

module.exports = router