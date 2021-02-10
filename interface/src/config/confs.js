// limite de turmas geral
module.exports.limiteTurmas = 4

var date = new Date()
var anoTotal = date.getFullYear()
var mes = date.getMonth()
var ano
if(mes < 9){
    ano = anoTotal.toString()
}
else{
    ano = (anoTotal+1).toString() 
}
var anoAtual = ano.charAt(2) + ano.charAt(3)

// ano atual (ex: 21)
module.exports.anoAtual = anoAtual

var intAno = parseInt(anoAtual)

// ano letivo atual (ex: 20/21)
module.exports.anoletivo = (intAno-1) + "/" + intAno

// ano letivo 2 (ex: 2020/2021)
module.exports.anoletivo2 = (anoTotal-1) + "/" + anoTotal

// nº dos últimos anos letivos a serem selecionados possivelmente 
var N = 7

// ultimos N anos letivos (ex: ["20/21", "19/20", ...])
var anosletivos = []

for(var i = 0; i < N; i++){
    var aux = (intAno-1-i) + "/" + (intAno-i)
    anosletivos.push(aux)
}

module.exports.anosletivos = anosletivos

// ultimos N anos letivos 2 (ex: ["2020/2021", "2019/2020", ...])
var anosletivos2 = []

for(var i = 0; i < N; i++){
    var aux = (anoTotal-1-i) + "/" + (anoTotal-i)
    anosletivos2.push(aux)
}

module.exports.anosletivos2 = anosletivos2
