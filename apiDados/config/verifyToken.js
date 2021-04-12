const Escolas = require('../controllers/db_aplicacoes/escolas')
const Alunos = require('../controllers/db_aplicacoes/alunos')
const Turmas = require('../controllers/db_aplicacoes/turmas')
const Professores = require('../controllers/db_aplicacoes/professor')
const { updateTurma } = require('../controllers/db_aplicacoes/alunos')
const CromosAlunos = require('../controllers/db_testeconhecimentos/cromos_alunos')

module.exports.verifyAdmin = function(){
    
    return  function(req, res, next) {
        var u = req.user.user
        if(u.type == 50) next()
        else res.status(403).jsonp("Não tem permissão.")
    }

}

module.exports.verifyAdminEMunicipio = function(){
    return  function(req, res, next) {
        var u = req.user.user
        if(u.type == 50 || (u.type == 30 && u.infoEscola.localidade == req.params.municipio)) next()
        else res.status(403).jsonp("Não tem permissão.")
    }
}

module.exports.verifyAdmin_Municipio_Agrupamento = function(){

    return  function(req, res, next) {
        var u = req.user.user
        var escola = req.params.codigo
        // admin
        if(u.type == 50) next()
        // agrupamento
        else if(u.type == 40 && escola == u.escola) next()
        // municipio
        else if(u.type == 30 && u.escolas.find(e => e.cod == escola)) next()
        // professor
        else if(u.type == 20 && u.escola == escola) next()
        else res.status(403).jsonp("Não tem permissão.")
    }
}

module.exports.verifyAdmin_Professor_Aluno = function(){
    return async function(req, res, next) {
        var u = req.user.user
        var id = req.params.id
        // admin
        if(u.type == 50) next()
        // aluno
        else if(u.type == 10 && u.id == id) next()
        // professor
        else if(u.type == 20){
            var aluno = await Alunos.getAluno(id)
            if(aluno && u.codigo.toUpperCase() == aluno.codprofessor.toUpperCase()) next()
            else res.status(403).jsonp("Não tem permissão.")
        }
        else res.status(403).jsonp("Não tem permissão.")
    }
}

module.exports.verifyAdmin_Professor_Aluno2 = function(){
    return async function(req, res, next) {
        var u = req.user.user
        var user = req.params.user
        // admin
        if(u.type == 50) next()
        // aluno
        else if(u.type == 10 && u.user == user) next()
        // professor
        else if(u.type == 20){
            var aluno = await Alunos.getAlunoByUser(user)
            if(aluno && u.codigo.toUpperCase() === aluno.codprofessor.toUpperCase()) next()
            else res.status(403).jsonp("Não tem permissão.")
        }
        else res.status(403).jsonp("Não tem permissão.")
    }
}

module.exports.verifyAdmin_Professor = function(){
    return function(req, res, next) {
        var u = req.user.user
        var codprofessor = req.body.codprofessor;

        if(u.type == 50 || (u.type == 20 && u.codigo.toUpperCase() === codprofessor.toUpperCase())) next()
        else res.status(403).jsonp("Não tem permissão.")
    }
}

module.exports.verifyAdmin_Professor2 = function(){
    return function(req, res, next) {
        var u = req.user.user
        var codprofessor = req.body.idprofessor;

        if(u.type == 50 || (u.type == 20 && u.codigo.toUpperCase() === codprofessor.toUpperCase())) next()
        else res.status(403).jsonp("Não tem permissão.")
    }
}

module.exports.verifyUserProf = function(){
    return function(req, res, next) {
        var u = req.user.user
        var id = req.params.id

        if( ((u.type == 50) || (u.id == id)) && u.type != 10  ) next()
        else res.status(403).jsonp("Não tem permissão.")
    }
}

module.exports.verifyUserProf2 = function(){
    return async function(req, res, next) {
        var u = req.user.user
        var codigo = req.params.codigo

        if( ((u.type == 50) || (u.codigo.toUpperCase() === codigo.toUpperCase())) && u.type != 10  ) next()
        else if(u.type == 30){
            var professor = await Professores.getProfessorByCodigo(codigo)
            if(u.escolas.find(e => e.cod == professor.escola)) next()
            else res.status(403).jsonp("Não tem permissão.")
        }
        else res.status(403).jsonp("Não tem permissão.")
    }
}

module.exports.verifyTurma = function(){
    return async function(req, res, next) {
        var u = req.user.user
        var idTurma = req.params.id

        if( u.type == 50 ) next()
        else if( u.type != 10){
            var turmas = await Turmas.getTurmasByProfessor(u.codigo)
            if(turmas.find(e => e.id == idTurma)) next()
            else res.status(403).jsonp("Não tem permissão.")
        }
        else res.status(403).jsonp("Não tem permissão.")
    }
}

module.exports.verifyTurma2 = function(){
    return async function(req, res, next) {
        var u = req.user.user
        var codprofessor = req.query.codprofessor

        if(!codprofessor) res.status(400).jsonp("É necessário indicar o professor pertencente à turma.")

        if( u.type == 50 ) next()
        // professor
        else if( u.type == 20 && u.codigo == codprofessor ) next()
        else {
            var professor = await Professores.getProfessorByCodigo(codprofessor)
            // agrupamento
            if(u.type == 40 && u.escola == professor.escola) next()
            // municipio
            else if (u.type == 30 && u.escolas.find(esc => esc.cod == professor.escola)) next()
            else res.status(403).jsonp("Não tem permissão.")
        } 
        
    }
}

module.exports.verifyTurma3 = function(){
    return async function(req, res, next) {
        var u = req.user.user
        var turma = req.params.turma
        var escola = req.query.escola
        var codprofessor = req.query.codprofessor

        if(!escola) res.status(400).jsonp("É necessário indicar a escola pertencente à turma.")

        if( u.type == 50 ) next()
        // professor
        else if( u.type == 20 && u.codigo == codprofessor) next() 
        // agrupamento
        else if(u.type == 40 && u.escola == escola) next()
        // municipio
        else if (u.type == 30 && u.escolas.find(esc => esc.cod == escola)) next()
        else res.status(403).jsonp("Não tem permissão.") 
        
    }
}

module.exports.verifyTurma4 = function(){
    return async function(req, res, next) {
        var u = req.user.user
        var codprofessor = req.query.codprofessor

        if( u.type == 50 ) next()
        else if( u.type == 20 && u.codigo == codprofessor ) next()
        else res.status(403).jsonp("Não tem permissão.")
    }
}

module.exports.verifyProfTurmas = function(){
    return async function(req, res, next) {
        var u = req.user.user
        var codigo = req.params.codigo

        if( u.type == 50 ) next()
        // professor
        else if( u.type == 20 && u.codigo == codigo) next()
        else {
            var professor = await Professores.getProfessorByCodigo(codigo)
            // agrupamento
            if(u.type == 40 && u.escola == professor.escola) next()
            // municipio
            else if (u.type == 30 && u.escolas.find(esc => esc.cod == professor.escola)) next()
            else res.status(403).jsonp("Não tem permissão.")
        }              
    }
}

module.exports.verifyAluno = function(){
    return function(req, res, next) {
        var u = req.user.user
        var user = req.params.user
        if(u.type == 50) next()
        else if(u.type == 10 && u.user == user) next()
        else res.status(403).jsonp("Não tem permissão.")
    }
}

module.exports.verifyAluno2 = function(){
    return async function(req, res, next) {
        var u = req.user.user
        var user = await CromosAlunos.getUserFromoCromoId(req.params.id)

        if(u.type == 50) next()
        else if(user && u.type == 10 && u.user == user.user) next()
        else res.status(403).jsonp("Não tem permissão.")
    }
}