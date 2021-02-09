const fs = require('fs')

 

var professores = require("./professores.json");
var alunos = require("./alunos.json")

for(i in professores){
    var day = Math.floor(Math.random() * 30) + 1
    var month = Math.floor(Math.random() * 12) + 1 
    professores[i].nome = "Professor n" + i
    professores[i].email = "professor" + i + "@hotmail.com"
    professores[i].validade = professores[i].validade.substr(0, 10)
    professores[i].validade = professores[i].validade.replace("/", "-");
}


for(j in alunos){
    var day = Math.floor(Math.random() * 30) + 1
    var month = Math.floor(Math.random() * 12) + 1 
    var year = 1998 + Math.floor(Math.random() * 6) + 1 
    var date = day + "/" + month + "/" + year
    alunos[j].datanascimento = date
    alunos[j].nome = "Aluno n" + j
    alunos[j].email = "aluno" + j +"@hotmail.com"
}


console.log("FINISHED RANDOM")

fs.writeFileSync("professores.json", JSON.stringify(professores), "utf8")
fs.writeFileSync("alunos.json", JSON.stringify(alunos), "utf8")

var sqlProf = "INSERT INTO `hypat_aplicacoes`.`professores` (`id`, `codigo`, `nome`, `escola`, `email`, `password`, `confirmacao`, `premium`, `validade`, `socionum`, `projeto`) VALUES"

sqlProf += "(" +  professores[0].id + ",'" + professores[0].codigo + "','" + professores[0].nome 
           + "','" + professores[0].escola + "','" + professores[0].email + "','" + professores[0].password + "'," 
           + professores[0].confirmacao + "," + professores[0].premium + ",'" + professores[0].validade + "',"
           + professores[0].socionum + ",'" + professores[0].projeto + "')"

for(var index = 1; index < professores.length; index++){
    sqlProf += "," + "(" +  professores[index].id + ",'" + professores[index].codigo + "','" + professores[index].nome 
            + "','" + professores[index].escola + "','" + professores[index].email + "','" + professores[index].password + "'," 
            + professores[index].confirmacao + "," + professores[index].premium + ",'" + professores[index].validade + "',"
            + professores[index].socionum + ",'" + professores[index].projeto + "')"    
}

sqlProf += ";"

var sqlInsert = "INSERT INTO `hypat_aplicacoes`.`alunos` (`id`, `user`, `numero`, `nome`, `datanascimento`, `escola`, `turma`, `email`, `password`, `codprofessor`, `pais`, `confirmacao`) VALUES"
sqlAlunos = "INSERT INTO `hypat_aplicacoes`.`alunos` (`id`, `user`, `numero`, `nome`, `datanascimento`, `escola`, `turma`, `email`, `password`, `codprofessor`, `pais`, `confirmacao`) VALUES"

sqlAlunos += "(" + alunos[0].id + ",'" + alunos[0].user + "'," + alunos[0].numero +
             ",'" + alunos[0].nome + "','" + alunos[0].datanascimento + "','" + alunos[0].escola +
             "','" + alunos[0].turma + "','" + alunos[0].email + "','" + alunos[0].password + "','" +
             alunos[0].codprofessor + "','" + alunos[0].pais + "'," + alunos[0].confirmacao + ");"

for(var a = 1; a < alunos.length; a++){
    sqlAlunos += "\n" + sqlInsert + "(" + alunos[a].id + ",'" + alunos[a].user + "'," + alunos[a].numero +
    ",'" + alunos[a].nome + "','" + alunos[a].datanascimento + "','" + alunos[a].escola +
    "','" + alunos[a].turma + "','" + alunos[a].email + "','" + alunos[a].password + "','" +
    alunos[a].codprofessor + "','" + alunos[a].pais + "'," + alunos[a].confirmacao + ");" 
}

fs.writeFileSync("alunos.sql", sqlAlunos + "\n", "utf8")

console.log("Byeeee")