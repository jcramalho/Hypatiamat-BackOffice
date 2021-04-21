var express = require('express');
var router = express.Router();
var passport = require('passport')
var multer = require('multer')
var fs = require('fs');
var upload = multer({dest: 'uploads/'})

const verifyToken = require('../../config/verifyToken')
const Campeonatos = require('../../controllers/db_testeconhecimentos/campeonatos');
const CampeonatosCRUD = require('../../controllers/db_testeconhecimentos/campeonatosCRUD');
const Campeonatos_Certificados = require('../../controllers/db_testeconhecimentos/campeonatos_certificados');
const { getCromosCampeonatosCompletadosFromAluno } = require('../../controllers/db_testeconhecimentos/cromos_alunos');

const root = __dirname + "/../../" 

// Todos os campeonatos realizados
router.get('/', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var municipio = req.query.municipio
    if(municipio){
        Campeonatos.getCampeonatosComMunicipio(municipio)
                   .then(dados => res.jsonp(dados))
                   .catch(erro => res.status(500).jsonp('Error'))
    }
    else{
        Campeonatos.getCampeonatos()
                .then(dados =>res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro))
    }
});

// Informação de um campeonato
router.get('/:cod', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    CampeonatosCRUD.getCampeonato(req.params.cod)
                   .then(dados => res.jsonp(dados))
                   .catch(erro => res.status(500).jsonp('Error'))
});


router.get('/:cod/jogos', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    Campeonatos.getJogosFromCampeonato(req.params.cod)
                   .then(dados => res.jsonp(dados))
                   .catch(erro => res.status(500).jsonp('Error'))
});

router.get('/:cod/rankingGeral', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var jogo = req.query.jogo
    if(jogo!=undefined){
        Campeonatos.getRankingGeral(req.params.cod, jogo)
                    .then(dados => res.jsonp(dados))
                    .catch(erro => res.status(500).jsonp('Error'))
    }
    else res.status(400).send('Falta o jogo em query string.')
});

router.get('/:cod/certificados', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    var jogo = req.query.jogo
    if(jogo!=undefined){
        Campeonatos_Certificados.getCertificadosFromCampeonato(req.params.cod, jogo)
                    .then(dados => res.jsonp(dados))
                    .catch(erro => res.status(500).jsonp('Error'))
    }
    else res.status(400).send('Falta o jogo em query string.')
});


router.get('/:cod/certificados/download', passport.authenticate('jwt', {session: false}), async function(req, res, next) {
    var jogo = req.query.jogo
    var campeonato = req.params.cod
    var user = req.query.user
    var posicao = req.query.posicao
    if(campeonato && (jogo!=undefined) && posicao){

        if(posicao >= 11) var certificado = await Campeonatos_Certificados.getCertificado(campeonato, jogo, 11) 
        else if(user) var certificado = await Campeonatos_Certificados.getCertificadoUser(user, campeonato, jogo, posicao)
        else {res.status(400).send('Parâmetros Inválidos.'); return;}

        console.log(certificado)
        if(certificado){
            var path = root + "ficheiros/certificados/" + campeonato + "/" + jogo + "/" + certificado.ficheiro
            res.download(path)
        }
        else res.status(400).send('Certificado Inexistente.')
    }
    else res.status(400).send('Faltam Parâmetros.')
})

router.get('/:cod/certificados/nome', passport.authenticate('jwt', {session: false}), async function(req, res, next) {
    var jogo = req.query.jogo
    var campeonato = req.params.cod
    var user = req.query.user
    var posicao = req.query.posicao
    if(campeonato && (jogo!=undefined) && posicao){
        if(posicao >= 11){
            Campeonatos_Certificados.getCertificado(campeonato, jogo, 11)
                                    .then(dados => res.jsonp(dados))
                                    .catch(erro => {console.log(erro); res.status(500).send('Error')})
        }
        else if(user){
            Campeonatos_Certificados.getCertificadoUser(user, campeonato, jogo, posicao)
                                    .then(dados => res.jsonp(dados))
                                    .catch(erro => {console.log(erro); res.status(500).send('Error')})
        }
        else res.status(400).send('Parâmetros Inválidos.')
    }
    else res.status(400).send('Faltam Parâmetros.')
})

router.get('/alunos/:user/ultimocampeonato', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var user = req.params.user
    if(user){
        CampeonatosCRUD.getUltimoCampeonato(user)
                    .then(dados =>res.jsonp(dados))
                    .catch(erro => res.status(500).jsonp(erro))
    }
    else res.status(400).send("Faltam parâmetros.")
});

router.get('/alunos/:user/campeonatos', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var user = req.params.user
    Campeonatos.getCampeonatoInfoAluno(user)
                .then(dados =>res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro))
});

router.get('/turmas/:turma/campeonatos', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var turma = req.params.turma
    var codprofessor = req.query.codprofessor
    if(codprofessor){
        Campeonatos.getCampeonatoInfoTurma(turma, codprofessor)
                    .then(dados =>res.jsonp(dados))
                    .catch(erro => res.status(500).jsonp(erro))
    }
    else res.status(400).send("Faltam parâmetros.")
});


// Estatísticas de um campeonato por todos os municipios ou um só município ou por uma comunidade
router.get('/:campeonato/municipios', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var campeonato = req.params.campeonato;
    var municipio = req.query.municipio;
    var comunidade = req.query.comunidade;
    if(municipio){
        // por um municipio
        Campeonatos.getCampeonatoMunicipio(campeonato, municipio)
                   .then(dados =>res.jsonp(dados))
                   .catch(erro => res.status(500).jsonp(erro))
    }
    else if(comunidade){
        // por uma comunidade
        Campeonatos.getCampeonatoComunidade(campeonato, comunidade)
                   .then(dados =>res.jsonp(dados))
                   .catch(erro => res.status(500).jsonp(erro))
    }
    else{
        // por todos os municipios
        Campeonatos.getCampeonatoMunicipios(campeonato)
                   .then(dados =>res.jsonp(dados))
                   .catch(erro => res.status(500).jsonp(erro))
    }
});


// Estatísticas totais (sem o jogo) de um campeonato por todos os municipios ou um só município ou por uma comunidade
router.get('/:campeonato/municipios/totais', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var campeonato = req.params.campeonato;
    var comunidade = req.query.comunidade;
    if(comunidade){
        // por uma comunidade
        Campeonatos.getCampeonatoComunidadeTotais(campeonato, comunidade)
                   .then(dados =>res.jsonp(dados))
                   .catch(erro => res.status(500).jsonp(erro))
    }
    else{
        // por todos os municipios
        Campeonatos.getCampeonatoMunicipiosTotais(campeonato)
                   .then(dados =>res.jsonp(dados))
                   .catch(erro => res.status(500).jsonp(erro))
    }
});

// Estatísticas de um campeonato por todos os municipios ou um só município
router.get('/:campeonato/municipios/gerais', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var campeonato = req.params.campeonato;
    Campeonatos.getCampeonatoMunicipiosGerais(campeonato)
               .then(dados =>res.jsonp(dados))
               .catch(erro => res.status(500).jsonp(erro))
    
});

// Estatísticas de um campeonato por todos os agrupamentos de um municipio ou um só agrupamento
router.get('/:campeonato/municipios/:municipio', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var campeonato = req.params.campeonato;
    var municipio = req.params.municipio
    var escola = req.query.escola;
    if(escola){
        Campeonatos.getCampeonatoAgrupamento(campeonato, escola)
                   .then(dados =>res.jsonp(dados))
                   .catch(erro => res.status(500).jsonp(erro))
    }
    else{
        Campeonatos.getCampeonatoMunicipioAgrupamentos(campeonato, municipio)
                   .then(dados =>res.jsonp(dados))
                   .catch(erro => res.status(500).jsonp(erro))
    }
});

router.get('/:campeonato/escolas/:escola', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var campeonato = req.params.campeonato;
    var escola = req.params.escola;
    Campeonatos.getCampeonatoAgrupamentoProfessores(campeonato, escola)
               .then(dados =>res.jsonp(dados))
               .catch(erro => res.status(500).jsonp(erro))
});

router.get('/:campeonato/escolas/:escola/gerais', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var campeonato = req.params.campeonato;
    var escola = req.params.escola;
    Campeonatos.getCampeonatoAgrupamentoGerais(campeonato, escola)
               .then(dados =>res.jsonp(dados))
               .catch(erro => res.status(500).jsonp(erro))
});

router.get('/:campeonato/turmas/:turma', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var campeonato = req.params.campeonato;
    var turma = req.params.turma;
    var escola = req.query.escola;
    var codprofessor = req.query.codprofessor
    var jogo = req.query.jogo
    if(codprofessor && turma && jogo && escola){
        Campeonatos.getCampeonatoTurma(campeonato, escola, turma, codprofessor, jogo)
                    .then(dados =>res.jsonp(dados))
                    .catch(erro => res.status(500).jsonp(erro))
    }
    else res.status(400).send("Faltam parâmetros (turma ou codprofessor)")
});

router.get('/:campeonato/alunos/:user', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var campeonato = req.params.campeonato;
    var user = req.params.user
    var turma = req.query.turma;
    var escola = req.query.escola;
    var codprofessor = req.query.codprofessor
    var jogo = req.query.jogo
    if(turma && escola && codprofessor && jogo){
        Campeonatos.getDesempenhoAlunoCampeonato(campeonato, jogo, escola, codprofessor, turma, user)
                    .then(dados =>res.jsonp(dados))
                    .catch(erro => res.status(500).jsonp(erro))
    }
    else res.status(400).send("Faltam parâmetros.")
});


router.get('/:campeonato/municipios/:municipio/gerais', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var campeonato = req.params.campeonato;
    var municipio = req.params.municipio
    Campeonatos.getCampeonatoMunicipioGerais(campeonato, municipio)
                   .then(dados =>res.jsonp(dados))
                   .catch(erro => res.status(500).jsonp(erro))
});

router.get('/:campeonato/comunidades/:comunidade/gerais', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var campeonato = req.params.campeonato;
    var comunidade = req.params.comunidade
    Campeonatos.getCampeonatoComunidadeGerais(campeonato, comunidade)
                   .then(dados =>res.jsonp(dados))
                   .catch(erro => res.status(500).jsonp(erro))
});

router.put('/:codigo', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    CampeonatosCRUD.updateCampeonato(req.params.codigo, req.body)
                   .then(dados =>res.jsonp(dados))
                   .catch(erro => res.status(500).jsonp(erro))
});

router.post('/', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    CampeonatosCRUD.insertCampeonato(req.body)
                   .then(dados =>res.jsonp(dados))
                   .catch(erro => res.status(500).jsonp(erro))
});

router.post('/:cod/certificados', upload.single('file'), passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), async function(req, res){
    let campeonato = req.params.cod
    let jogo = req.query.jogo
    let posicao = req.query.posicao
    let user = req.query.user
    let file = req.file

    if(campeonato && (jogo!=null || jogo!=undefined) && posicao && file){
        let newPath = root + 'ficheiros/certificados/' + campeonato + "/"

        if (!fs.existsSync(newPath)){
            fs.mkdirSync(newPath);
        }
        
        newPath += jogo + '/'
        
        if (!fs.existsSync(newPath)){
            fs.mkdirSync(newPath);
        }

        let oldPath = root + file.path
        let newPathFile = newPath + file.originalname;
        
        var userid = ''
        if(user) {
            userid = user
            var certificado = await Campeonatos_Certificados.getCertificadoUser(userid, campeonato, jogo, posicao)  
        }
        else var certificado = await Campeonatos_Certificados.getCertificado(campeonato, jogo, posicao)

        if(certificado){
            let oldFile = root + 'ficheiros/certificados/' + campeonato + "/" + jogo + "/" + certificado.ficheiro
            if (fs.existsSync(oldFile)){
                fs.unlinkSync(oldFile)
            }
        }
        fs.copyFile(oldPath, newPathFile, function(err){
            if(err) throw err
            
            fs.unlinkSync(oldPath);
            
            if(certificado){
                Campeonatos_Certificados.updateCertificado(certificado.id, file.originalname)
                                        .then(() => res.jsonp({posicao: posicao, ficheiro: file.originalname, user: userid}))
                                        .catch(erro => {console.log(erro); res.status(500).send('Erro.')})
            }
            else{
                Campeonatos_Certificados.insertCampeonato_Certificado(userid, campeonato, jogo, posicao, file.originalname)
                                        .then(() => res.jsonp({posicao: posicao, ficheiro: file.originalname, user: userid}))
                                        .catch(erro => {console.log(erro); res.status(500).send('Erro.')})
            }
        })
        
    }
    else res.status(400).send('Faltam Parâmetros.')
})

router.delete('/:codigo', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    CampeonatosCRUD.apagarCampeonato(req.params.codigo)
                   .then(dados =>res.jsonp(dados))
                   .catch(erro => res.status(500).jsonp(erro))
});

module.exports = router