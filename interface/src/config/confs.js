// limite de turmas geral
module.exports.limiteTurmas = 4

// limite de alunos por Turma geral
module.exports.limiteAlunos = 30

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
module.exports.anoletivo2 = (parseInt(ano) -1) + "/" + parseInt(ano)

module.exports.dataInicio1 = (parseInt(ano) -1) + "-09-01"
module.exports.dataFim1 = (parseInt(ano)) + "-09-01"

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

module.exports.campeonatosAnos = [{ano:1, jogos:[0, 8]}, {ano:2, jogos:[1, 2, 9]}, {ano:3, jogos:[3, 4]},
                                    {ano:4, jogos:[5]}, {ano:5, jogos:[6]}, {ano:6, jogos:[6]},
                                    {ano:7, jogos:[7]}, {ano:8, jogos:[7]}, {ano:9, jogos:[7]}]