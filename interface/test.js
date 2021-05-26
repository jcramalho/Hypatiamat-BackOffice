var date = new Date('2021-09-01')
var anoTotal = date.getFullYear()
var mes = date.getMonth()
var ano
if(mes+1 < 9){
    ano = anoTotal.toString()
}
else{
    ano = (anoTotal+1).toString() 
}
var anoAtual = ano.charAt(2) + ano.charAt(3)

// ano atual (ex: 21)
var anoAtual = anoAtual

var intAno = parseInt(anoAtual)

// ano letivo atual (ex: 20/21)
var anoletivo = (intAno-1) + "/" + intAno

// ano letivo 2 (ex: 2020/2021)
var anoletivo2 = (parseInt(ano) -1) + "/" + parseInt(ano)

console.log(anoAtual)

console.log(anoletivo)

console.log(anoletivo2)