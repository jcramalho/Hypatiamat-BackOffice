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
  console.log(aluno)
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
              var utilizador = await Professores.getProfessorByCodigo(user)
              utilizador.type = 20
              //municipio
              if(utilizador.premium == 2) utilizador.type = 30
              // agrupamento
              else if(utilizador.premium == 3) utilizador.type = 40
              // admin
              else if(utilizador.premium == 5) utilizador.type = 50

              return {
                  type : utilizador.type,
                  authentication : true, 
                  token : generateToken(utilizador)
              }
          }
          else return {authentication:false}
      }
  }
}