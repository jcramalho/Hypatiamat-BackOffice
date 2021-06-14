var jwt = require('jsonwebtoken')
var md5 = require('md5');

var Alunos = require('../controllers/db_aplicacoes/alunos');
var Professores = require('../controllers/db_aplicacoes/professor');
var Escolas = require('../controllers/db_aplicacoes/escolas')

const jwtKey = "tese-hypatiamat2020"

/*
const profExperimental = 'hprof2'
const alunoExperimental = 'aluno1'
*/

const profExperimental = 'hypatiat'
const alunoExperimental = 'h21082f109'

const jwtExpirySecondsExperimental = 30 * 60
const jwtExpirySeconds = 90 * 60
const jwtExpirySecondsAdmin = 90 * 60
const jwtExpirySecondsInterface = 180 * 60

generateToken = function(user, time){

    const token = jwt.sign({ user }, jwtKey, {
		algorithm: "HS256",
		expiresIn: time,
    })

    return token
} 

module.exports.getTokenProfExperimental = async function(){
    var utilizadorAux = await Professores.getProfessorByCodigo(profExperimental)
    var utilizador = {
        id : utilizadorAux.id,
        codigo : utilizadorAux.codigo,
        email : utilizadorAux.email,
        escola: utilizadorAux.escola,
        type: 5
      }
    return {
        type : 5,
        authentication : true, 
        token : generateToken(utilizador, jwtExpirySecondsExperimental)
    }
}

module.exports.getTokenAlunoExperimental = async function(){
    var utilizadorAux = await Alunos.getAlunoByUser(alunoExperimental)
    var utilizador = {
        agrupamento: await Escolas.getEscola(utilizadorAux.escola).nome,
        id : utilizadorAux.id,
        user : utilizadorAux.user,
        email: utilizadorAux.email,
        escola: utilizadorAux.escola,
        type: 3
    }
    return {
        type : 3,
        authentication : true, 
        token : generateToken(utilizador, jwtExpirySecondsExperimental)
    }
}

module.exports.getTokenInterface = async function(){
    var utilizador = {
        type: 0
    }
    return {
        type : 0,
        token : generateToken(utilizador, jwtExpirySecondsInterface)
    }
}

module.exports.login = async function(user, password){
  var md5Password = md5(password)

  var aluno = await Alunos.getPassword(user)
  if (aluno != undefined){
      if(md5Password == aluno.password){
          var utilizadorAux = await Alunos.getAlunoByUser(user)
          var prof = await Professores.getProfessorByCodigo(utilizadorAux.codprofessor)
          if(!prof.valido || prof.premium != 1) return {authentication:false}
          var utilizador = {
              agrupamento: await Escolas.getEscola(utilizadorAux.escola).nome,
              id : utilizadorAux.id,
              user : utilizadorAux.user,
              email: utilizadorAux.email,
              escola: utilizadorAux.escola,
              type: 10
          }
          return {
              type : 10,
              authentication : true, 
              token : generateToken(utilizador, jwtExpirySeconds)
          }
      }
      else return {authentication:false}
  }
  else{
      var professor = await Professores.getPassword(user)
      if (professor == undefined) return {authentication:false}
      else {
          if(md5Password == professor.password){
              var utilizadorAux = await Professores.getProfessorByCodigo(user)
              var time = jwtExpirySeconds
              var utilizador = {
                id : utilizadorAux.id,
                codigo : utilizadorAux.codigo,
                email : utilizadorAux.email,
                escola: utilizadorAux.escola,
                type: 20
              }
              // professor
              if(utilizadorAux.premium == 1){
                utilizador.agrupamento = (await Escolas.getEscola(utilizadorAux.escola)).nome
              }
              //municipio
              else if(utilizadorAux.premium == 2) {
                  utilizador.type = 30
                  utilizador.infoEscola = await Escolas.getEscola(utilizadorAux.escola)
                  utilizador.escolas = await Escolas.getEscolasByLocalidade(utilizador.infoEscola.localidade)
              }
              // agrupamento
              else if(utilizadorAux.premium == 3) {
                  utilizador.type = 40
                  utilizador.agrupamento = (await Escolas.getEscola(utilizadorAux.escola)).nome
              }
              // admin
              else if(utilizadorAux.premium == 5) {
                  utilizador.type = 50
                  utilizador.agrupamento = (await Escolas.getEscola(utilizadorAux.escola)).nome
                  time = jwtExpirySecondsAdmin
              }

              return {
                  type : utilizador.type,
                  authentication : true, 
                  token : generateToken(utilizador, time)
              }
          }
          else return {authentication:false}
      }
  }
}