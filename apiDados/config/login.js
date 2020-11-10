var jwt = require('jsonwebtoken')
var md5 = require('md5');

var Alunos = require('../controllers/db_aplicacoes/alunos');
var Professores = require('../controllers/db_aplicacoes/professor');

const jwtKey = "tese-hypatiamat2020"
const jwtExpirySeconds = 60 * 60

generateToken = function(user){

    const token = jwt.sign({ user }, jwtKey, {
		algorithm: "HS256",
		expiresIn: jwtExpirySeconds,
    })

    return token
} 

module.exports.login = async function(user, password){
  var md5Password = md5(password)

  var aluno = await Alunos.getPassword(user)
  if (aluno != undefined){
      if(md5Password == aluno.password){
          var utilizador = await Alunos.getAlunoByUser(user)
          utilizador.type = 10
          return {
              type : 10,
              authentication : true, 
              token : generateToken(utilizador)
          }
      }
      else return {authentication:false}
  }
  else{
      var professor = await Professores.getPassword(user)
      if (professor == undefined) return {authentication:false}
      else {
          if(md5Password == professor.password){
              var type = 20
              var utilizador = await Professores.getProfessorByCodigo(user)
              if(professor.premium == 1) type = 30
              utilizador.type = type
              return {
                  type : type,
                  authentication : true, 
                  token : generateToken(utilizador)
              }
          }
          else return {authentication:false}
      }
  }
}