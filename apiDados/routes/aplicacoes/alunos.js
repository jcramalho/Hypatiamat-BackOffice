var express = require('express');
var router = express.Router();
var passport = require('passport')

var fs = require('fs')
var fastcsv = require('fast-csv')
var CSV = require('csv-string');
var multer = require('multer')
var upload = multer({dest: 'uploads/'})
var verifyToken = require('../../config/verifyToken')

var Alunos = require('../../controllers/db_aplicacoes/alunos');
var Professores = require('../../controllers/db_aplicacoes/professor');
var Escolas = require('../../controllers/db_aplicacoes/escolas')
const TurmasOld = require('../../controllers/db_aplicacoes/turmasold');
const Turmas = require('../../controllers/db_aplicacoes/turmas');

// ['user', 'numero', 'nome', 'datanascimento', 'escola', 'turma', 'email', 'password', 'codprofessor', 'pais'],
async function verifyAluno(aluno){
  var alunoAux = await Alunos.getAlunoByUser(aluno.user)
  var professorAux = await Professores.getProfessorByCodigo(aluno.codprofessor)
  var escolaAux = await Escolas.getEscola(aluno.escola)
  var turma = await Turmas.getTurmaByNomeProfessor(aluno.turma, aluno.codprofessor)
  if(!alunoAux && professorAux && escolaAux && turma){
     return {response: true}
  }
  else {
    var erros = []
    if(alunoAux) erros.push('Código de aluno indicado já existente.')
    if(!professorAux) erros.push('Código de professor indicado não existe.')
    if(!escolaAux) erros.push('Código de escola indicado não existe.')
    if(!turma) erros.push('Turma não existente.')
    return {response: false, erros:erros}
  }
}

router.get('/', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    Alunos.getAlunos()
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

router.get('/codigos', function(req, res, next) {
  Alunos.getAlunosCodigo()
             .then(dados =>{
               res.jsonp(dados)
             })
             .catch(erro => res.status(500).jsonp(erro))
});

/* GET devolve a informação de um aluno. */
router.get('/:id', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin_Professor_Aluno(), function(req, res, next) {
    Alunos.getAluno(req.params.id)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

/* GET devolve todos os registos de um jogo de um aluno. */
router.get('/:user/jogos/:jogoTable', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin_Professor_Aluno2(), function(req, res, next) {
  Alunos.getJogosFromAluno(req.query.dataInicio, req.query.dataFim, req.query.jogoTipo, req.params.jogoTable, req.params.user)
             .then(dados =>{
               res.jsonp(dados)
             })
             .catch(erro => res.status(500).jsonp(erro))
});

/* GET devolve as estatisticas gerais de um jogo de um aluno. */
router.get('/:user/jogosGlobal/:jogoTable', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin_Professor_Aluno2(), function(req, res, next) {
  Alunos.getJogosGlobalFromAluno(req.query.dataInicio, req.query.dataFim, req.query.jogoTipo, req.params.jogoTable, req.params.user)
             .then(dados =>{
               res.jsonp(dados)
             })
             .catch(erro => res.status(500).jsonp(erro))
});

/* PUT altera a informação de um aluno. */
router.put('/:id', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin_Professor_Aluno(), function(req, res, next) {
    Alunos.updateAluno(req.params.id, req.body)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});


/* PUT altera a escola de um aluno. */
router.put('/:id/escola', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin_Professor_Aluno(), function(req, res, next) {
  Alunos.updateTurma(req.params.id, req.body.turma)
             .then(dados =>{
                  //TurmaOld.insertTurmaOld()
                  res.jsonp(dados)
             })
             .catch(erro => res.status(500).jsonp(erro))
});

/* PUT altera a turma de uma lista de alunos. */
router.put('/turmas/:turma', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin_Professor(), async function(req, res, next) {
    var alunos = req.body.alunos;
    
    var codTurmaOld = req.body.turmaOld;
    var codTurmaNova = req.params.turma;
    var codprofessor = req.body.codprofessor;
    var codescola = req.body.codescola;
    var codprofessorNovo
    // caso exista uma mudança de professor
    if(req.body.codprofessorNovo) codprofessorNovo = req.body.codprofessorNovo;
    else codprofessorNovo = codprofessor

    if(alunos && codTurmaOld && codTurmaNova && codprofessor){ 
      // validacao das turmas
      var turmaAntiga = await Turmas.getTurmaByNomeProfessor(codTurmaOld, codprofessor)
      var turmaNova = await Turmas.getTurmaByNomeProfessor(codTurmaNova, codprofessorNovo)
      if(!turmaAntiga) {res.status(400).jsonp({response: "Turma Antiga Inválida."}) ; return;}
      if(!turmaNova.anoletivo) {res.status(400).jsonp({response: "Turma Nova Inválida."}); return; } 

      var erros = []

      for(var i = 0; i < alunos.length; i++){
        var username
        if(alunos[i].user) username = alunos[i].user
        else username = alunos[i]
        var aluno = await Alunos.getAlunoByUser(username)

        if(aluno.id){
          // caso o aluno exista
          var alunoTurmaOld = {
            codAluno : username,
            turma : codTurmaOld,
            codProfessor : codprofessor,
            anoletivo : turmaAntiga.anoletivo
          }
          await TurmasOld.insertTurmaOld(alunoTurmaOld) 
                   .catch(error => console.log(error))
          if(codescola){
            await Alunos.updateTurmaEscola(username, codTurmaNova, codprofessorNovo, codescola)
                      .catch(erro => console.log(erro))
          }
          else{
            await Alunos.updateTurma(username, codTurmaNova, codprofessorNovo)
                      .catch(erro => console.log(erro))
          }
        }
        else {
          erros.push(username)
        }
      }

      var response = "Turma dos alunos alteradas com sucesso (" + (alunos.length - erros.length) + " alunos)."
      if(erros.length > 0) {
        response += "\n" + "No entanto, os seguintes códigos de alunos existem e, portanto, não foram alterados: " + JSON.stringify(erros)
      }
      res.jsonp({response: response})
  }
  else res.status(400).jsonp({response: 'Existem campos que devem ser fornecidos em falta.'})
});

/* PUT altera a password de um aluno. */
router.put('/:id/password', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin_Professor_Aluno(), function(req, res, next) {
  Alunos.updatePassword(req.params.id, req.body.password)
             .then(dados =>{
                  res.jsonp(dados)
             })
             .catch(erro => res.status(500).jsonp(erro))
});

/* POST insere um novo aluno. */
router.post('/', function(req, res, next) {
    Alunos.insertAluno(req.body)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

/* POST insere um csv de alunos. */
router.post('/csv', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), upload.single('ficheiro'),  function(req, res, next) {
    let path = __dirname + '/../../'+req.file.path    
    let alunos = []
    let erros = []
    let i = 1;
    var stringfile = fs.readFileSync(path).toString()
    //console.log(stringfile)
    var delimiter = CSV.detect(stringfile)

    fs.createReadStream(path, {encoding:'binary'})
      .pipe(fastcsv.parse({ headers: ['user', 'numero', 'nome', 'datanascimento', 'escola', 'turma', 'email', 'password', 'codprofessor', 'pais'], delimiter:delimiter, encoding:'utf8' }))
      .on('error', error => console.error(error))
      .on('data', row => {
          if(row.user && row.numero && row.nome && row.datanascimento && row.escola && row.turma && row.email && row.password && row.codprofessor && row.pais){
            let aluno = row
            aluno.confirmacao = 1
            alunos.push(aluno)
          }
          else{
            erros.push(i++)
          }
      })
      .on('end', async rowCount => {
        var errosCodigos = []
        for(var i = 1; i < alunos.length; i++){
          
          var aluno = alunos[i]
          var verificacao = await verifyAluno(aluno)
          if(verificacao.response){
            Alunos.insertAluno(aluno)
          }
          else{
            errosCodigos.push({
              linha: i,
              erros: verificacao.erros
            })
          }
        }
        var message = 'Foram inseridos ' + (alunos.length-1-errosCodigos.length) + ' alunos.\nHouve ' + erros.length + ' erros por faltarem colunas por preencher.\n\n'
        for(var i = 0; i < errosCodigos.length; i++){
          message += '>> Linha ' + errosCodigos[i].linha + " (" + errosCodigos[i].erros.length +" erros): " + "\n";
          for(var j = 0; j < errosCodigos[i].erros.length; j++){
            message += "-" + errosCodigos[i].erros[j] + "\n"
          }
          message += "\n"
        }
        res.jsonp(message)
        
      });
  
});

/* DELETE apaga um aluno. */
router.delete('/:codigo', passport.authenticate('jwt', {session: false}), verifyToken.verifyAdmin(), function(req, res, next) {
    Alunos.apagar(req.params.codigo)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

module.exports = router