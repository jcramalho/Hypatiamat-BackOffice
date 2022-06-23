//const host = "http://localhost:3050/"
const host = "http://localhost:8000/backoffice-api/"
//const host = "https://api.hypatiamat.com/"
//const hostTPC = "https://tpc.hypatiamat.com"
const hostTPC = "http://localhost:8081"
module.exports.host = host
module.exports.hostTPC = hostTPC
module.exports.hostAPI = host + "aplicacoes/"
module.exports.hostJogos = host + "jogos/"
module.exports.hostApps = host + "apps/"
module.exports.hostTrofeus = host + "trofeus/"
module.exports.hostCampeonatos = host + "campeonatos/"
module.exports.hostCromos = host + "cromos/"

module.exports.storageHosts = [
    // em desenvolvimento local, retirar de comentário
    //{origin: /localhost:8081$/, allow: ['get', 'set', 'del', 'getKeys', 'clear']},
    {origin: /hypatiamat.com$/, allow: ['get', 'set', 'del', 'clear']}
  ] 