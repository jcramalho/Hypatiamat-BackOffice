var express = require('express');
var router = express.Router();
var passport = require('passport')

var Apps = require('../../controllers/db_testeconhecimentos/apps');
const Rankings = require('../../controllers/db_testeconhecimentos/rankings');

// Todas os temas das apps
router.get('/temas', function(req, res, next) {
    Apps.getTemas()
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

// Todas os resultados de uma app ou de todas as apps por munícipio
router.get('/municipios', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var dataInicio = req.query.dataInicio;
    var dataFim = req.query.dataFim;
    var codtema = req.query.codtema
    var codsubtema = req.query.codsubtema

    if(codtema){
        // É um tema
        if(codsubtema){
            // Com subtema
            Apps.getAppFromMuncipiosSubTema(codtema, codsubtema, dataInicio, dataFim) 
                .then(dados =>{
                    res.jsonp(dados)
                })
                .catch(erro => res.status(500).jsonp(erro)) 
        }
        else{
            // Sem subtema
            Apps.getAppFromMuncipios(codtema, dataInicio, dataFim)
                .then(dados =>{
                    res.jsonp(dados)
                })
                .catch(erro => res.status(500).jsonp(erro)) 
        }
    }
    else{
        Apps.getAllAppsFromMunicipios(dataInicio, dataFim)
            .then(dados =>{
                res.jsonp(dados)
            })
            .catch(erro => res.status(500).jsonp(erro))
    }          
});

// Todas os resultados de uma app ou de todas as apps por escola de um municipio
router.get('/municipios/:municipio', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var dataInicio = req.query.dataInicio;
    var dataFim = req.query.dataFim;
    var municipio = req.params.municipio
    var codtema = req.query.codtema
    var codsubtema = req.query.codsubtema

    if(codtema){
        // É um tema
        if(codsubtema){
            // com subtema
            Apps.getAppFromMunicipioSubTema(codtema, codsubtema, municipio, dataInicio, dataFim)
                .then(dados =>{
                    res.jsonp(dados)
                })
                .catch(erro => res.status(500).jsonp(erro))
        }
        else{
            // sem subtema
            Apps.getAppFromMunicipio(codtema, municipio, dataInicio, dataFim)
                .then(dados =>{
                    res.jsonp(dados)
                })
                .catch(erro => res.status(500).jsonp(erro))   
        }
    }
    else{
        Apps.getAllAppsFromMunicipio(municipio, dataInicio, dataFim)
            .then(dados =>{
                res.jsonp(dados)
            })
            .catch(erro => res.status(500).jsonp(erro))
    }          
});

// Todas os resultados de uma app ou de todas as apps por municipio de uma comunidade
router.get('/comunidades/:comunidade', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var dataInicio = req.query.dataInicio;
    var dataFim = req.query.dataFim;
    var comunidade = req.params.comunidade
    var codtema = req.query.codtema
    var codsubtema = req.query.codsubtema

    if(codtema){
        // É um tema
        if(codsubtema){
            // com subtema
            Apps.getAppFromComunidadeSubTema(codtema, codsubtema, comunidade, dataInicio, dataFim)
                .then(dados =>{
                    res.jsonp(dados)
                })
                .catch(erro => res.status(500).jsonp(erro))
        }
        else{
            // sem subtema
            Apps.getAppFromComunidade(codtema, comunidade, dataInicio, dataFim)
                .then(dados =>{
                    res.jsonp(dados)
                })
                .catch(erro => res.status(500).jsonp(erro))   
        }
    }
    else{
        Apps.getAllAppsFromComunidade(comunidade, dataInicio, dataFim)
            .then(dados =>{
                res.jsonp(dados)
            })
            .catch(erro => res.status(500).jsonp(erro))
    }          
});

// Todas os resultados de uma app ou de todas as apps por professor de uma escola
router.get('/escolas/:escola', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var dataInicio = req.query.dataInicio;
    var dataFim = req.query.dataFim;
    var escola = req.params.escola
    var codtema = req.query.codtema
    var codsubtema = req.query.codsubtema

    if(codtema){
        // é um tema
        if(codsubtema){
            // com subtema
            Apps.getAppFromEscolaSubTema(codtema, codsubtema, escola, dataInicio, dataFim)
                .then(dados =>{
                    res.jsonp(dados)
                })
                .catch(erro => res.status(500).jsonp(erro))
        }
        else{
            // sem subtema
            Apps.getAppFromEscola(codtema, escola, dataInicio, dataFim)
                .then(dados =>{
                    res.jsonp(dados)
                })
                .catch(erro => res.status(500).jsonp(erro))
        }
    }
    else{
        Apps.getAllAppsFromEscola(escola, dataInicio, dataFim)
            .then(dados =>{
                res.jsonp(dados)
            })
            .catch(erro => res.status(500).jsonp(erro))
    }          
});

// Todas os resultados de uma app ou de todas as apps de uma turma
router.get('/turmas/:turma', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var dataInicio = req.query.dataInicio;
    var dataFim = req.query.dataFim;
    var turma = req.params.turma
    var codProf = req.query.codProf
    var codtema = req.query.codtema
    var codsubtema = req.query.codsubtema
    var horaInicio = req.query.horaInicio
    var horaFim = req.query.horaFim

    if(dataInicio && dataFim && codProf && horaInicio && horaFim){
        if(codtema){
            // é um tema
            if(codsubtema){
                // com subtema
                Apps.getAppFromTurmaSubTema(codtema, codsubtema, turma, codProf, dataInicio, dataFim, horaInicio, horaFim)
                    .then(dados =>{
                        res.jsonp(dados)
                    })
                    .catch(erro => res.status(500).jsonp(erro))
            }
            else{
                // sem subtema
                Apps.getAppFromTurma(codtema, turma, codProf, dataInicio, dataFim, horaInicio, horaFim)
                    .then(dados =>{
                        res.jsonp(dados)
                    })
                    .catch(erro => res.status(500).jsonp(erro))
            }
        }
        else{
            Apps.getAllAppsFromTurma(turma, codProf, dataInicio, dataFim, horaInicio, horaFim)
                .then(dados =>{
                    res.jsonp(dados)
                })
                .catch(erro => res.status(500).jsonp(erro))
        }    
    }      
    else res.status(400).jsonp('Faltam parâmetros')
});

router.get('/turmas/:turma/jogou', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var turma = req.params.turma
    var codprofessor = req.query.codprofessor
    var dataInicio = req.query.dataInicio
    var dataFim = req.query.dataFim
    if(turma && codprofessor && dataInicio && dataFim){
        Apps.getAppsFromTurma(turma, codprofessor, dataInicio, dataFim)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).jsonp(erro))
    }
    else res.status(400).jsonp('Faltam parâmetros')
})

// Todas os resultados de uma app ou de todas as apps de uma turma
router.get('/alunos/:user', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var dataInicio = req.query.dataInicio;
    var dataFim = req.query.dataFim;
    var user = req.params.user
    var codtema = req.query.codtema
    var codsubtema = req.query.codsubtema
    if(codtema){
        // é um tema
        if(codsubtema){
            // com subtema
            Apps.getAppFromAlunoSubTema(codtema, codsubtema, user, dataInicio, dataFim)
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro))
        }
        else{
            // sem subtema
            Apps.getAppFromAluno(codtema, user, dataInicio, dataFim)
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro))
        }
    }
    else{
        Apps.getAllAppsFromAluno(user, dataInicio, dataFim)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).jsonp(erro))
    } 
});

// Todas as apps que um aluno jogou num intervalo de tempo
router.get('/alunos/:user/jogou', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var dataInicio = req.query.dataInicio;
    var dataFim = req.query.dataFim;
    var user = req.params.user
   
    if(dataInicio && dataFim){
        Apps.getAppsFromAluno(user, dataInicio, dataFim)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).jsonp(erro))
    }
    else res.status(400).jsonp('Faltam parâmetros')
});

// por dia de um aluno
router.get('/alunos/:user/dias', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var user = req.params.user
    var codtema = req.query.codtema
    var codsubtema = req.query.codsubtema

    if(codtema && codsubtema){
        Apps.getAppFromAlunoPorDiaSubTema(user, codtema, codsubtema)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).jsonp(erro))
    }
    else if(codtema){
        Apps.getAppFromAlunoPorDiaTema(user, codtema)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).jsonp(erro))
    }
    else{
        res.status(500).jsonp('Faltam parâmetros.')
    }
});

router.get('/alunos/:user/acerto', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var user = req.params.user

    Apps.getAllAcertoFromAluno(user)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).jsonp(erro))
});


router.get('/alunos/:user/last10', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var user = req.params.user
    Apps.getLast10FromAluno(user)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).jsonp(erro))
})


// O ranking de uma app ou de todas as apps de uma turma (critério NTRC)
router.get('/turmas/:turma/ranking/NTRC', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var anoletivo = req.query.anoletivo
    var turma = req.params.turma
    var codProf = req.query.codProf
    var codtema = req.query.codtema
    var codsubtema = req.query.codsubtema
    var escola = req.query.escola
    // calculaRankingTurmaNTRC = async function(turma, escola, codprofessor, dataInicio, dataFim)
    if(turma && escola && codProf && anoletivo){
        var aux = anoletivo.split("/")
        if(aux){
            var dataInicio = aux[0] + "-09-01"
            var dataFim = aux[1] + "-09-01"
            if(codtema){
                // é um tema
                if(codsubtema){
                    // com subtema
                    Rankings.calculaRankingTurmaNTRCSubTema(turma, escola, codProf, dataInicio, dataFim, codtema, codsubtema)
                            .then(dados =>{
                                res.jsonp(dados)
                            })
                            .catch(erro => res.status(500).jsonp(erro))
                }
                else{
                    // sem subtema
                    Rankings.calculaRankingTurmaNTRCTema(turma, escola, codProf, dataInicio, dataFim, codtema)
                            .then(dados =>{
                                res.jsonp(dados)
                            })
                            .catch(erro => res.status(500).jsonp(erro))
                }
            }
            else{
                // todas
                Rankings.calculaRankingTurmaNTRC(turma, escola, codProf, dataInicio, dataFim)
                        .then(dados =>{
                            res.jsonp(dados)
                        })
                        .catch(erro => res.status(500).jsonp(erro))
            }
        }
        else res.status(400).jsonp("Ano letivo deve ser do tipo YYYY/YYYY.")
    }
    else res.status(400).jsonp("Parametros em falta.")          
});

// O ranking de uma app ou de todas as apps de uma turma (critério percentagem de acerto)
router.get('/turmas/:turma/ranking/Acerto', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var anoletivo = req.query.anoletivo
    var turma = req.params.turma
    var codProf = req.query.codProf
    var codtema = req.query.codtema
    var codsubtema = req.query.codsubtema
    var escola = req.query.escola
    // calculaRankingTurmaNTRC = async function(turma, escola, codprofessor, dataInicio, dataFim)
    if(turma && escola && codProf && anoletivo){
        var aux = anoletivo.split("/")
        if(aux){
            var dataInicio = aux[0] + "-09-01"
            var dataFim = aux[1] + "-09-01"
            if(codtema){
                // é um tema
                if(codsubtema){
                    // com subtema
                    Rankings.calculaRankingTurmaAcertoSubTema(turma, escola, codProf, dataInicio, dataFim, codtema, codsubtema)
                            .then(dados =>{
                                res.jsonp(dados)
                            })
                            .catch(erro => res.status(500).jsonp(erro))
                }
                else{
                    // sem subtema
                    Rankings.calculaRankingTurmaAcertoTema(turma, escola, codProf, dataInicio, dataFim, codtema)
                            .then(dados =>{
                                res.jsonp(dados)
                            })
                            .catch(erro => res.status(500).jsonp(erro))
                }
            }
            else{
                // todas
                Rankings.calculaRankingTurmaAcerto(turma, escola, codProf, dataInicio, dataFim)
                        .then(dados =>{
                            res.jsonp(dados)
                        })
                        .catch(erro => res.status(500).jsonp(erro))
            }
        }
        else res.status(400).jsonp("Ano letivo deve ser do tipo YYYY/YYYY.")
    }
    else res.status(400).jsonp("Parametros em falta.")          
});

module.exports = router