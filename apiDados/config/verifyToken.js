var Escolas = require('../controllers/db_aplicacoes/escolas')
var Alunos = require('../controllers/db_aplicacoes/alunos')
var Turmas = require('../controllers/db_aplicacoes/turmas')
var Professores = require('../controllers/db_aplicacoes/professor')

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
            //var escolasMun = await Escolas.getEscolasByLocalidade(u.infoEscola.localidade)
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
            if(u.codigo == aluno.codprofessor) next()
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
            if(u.codigo == aluno.codprofessor) next()
            else res.status(403).jsonp("Não tem permissão.")
        }
        else res.status(403).jsonp("Não tem permissão.")
    }
}

module.exports.verifyAdmin_Professor = function(){
    return function(req, res, next) {
        var u = req.user.user
        var codprofessor = req.body.codprofessor;

        if(u.type == 50 || (u.type == 20 && u.codigo == codprofessor)) next()
        else res.status(403).jsonp("Não tem permissão.")
    }
}

module.exports.verifyAdmin_Professor2 = function(){
    return function(req, res, next) {
        var u = req.user.user
        var codprofessor = req.body.idprofessor;

        if(u.type == 50 || (u.type == 20 && u.codigo == codprofessor)) next()
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
    return function(req, res, next) {
        var u = req.user.user
        var codigo = req.params.codigo

        if( ((u.type == 50) || (u.codigo == codigo)) && u.type != 10  ) next()
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
        else if( u.type == 20 && u.codigo == codprofessor) next()
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

        if(!escola) res.status(400).jsonp("É necessário indicar a escola pertencente à turma.")

        if( u.type == 50 ) next()
        // professor
        else if( u.type == 20){
            var turmaObj = await Turmas.getTurmaByNomeEscola(turma, escola)
            if(turmaObj.idprofessor == u.codigo) next()
            else res.status(403).jsonp("Não tem permissão.")
        } 
        // agrupamento
        else if(u.type == 40 && u.escola == escola) next()
        // municipio
        else if (u.type == 30 && u.escolas.find(esc => esc.cod == escola)) next()
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