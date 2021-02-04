var express = require('express');
var router = express.Router();
var passport = require('passport')

var fs = require('fs')
var fastcsv = require('fast-csv')
var CSV = require('csv-string');
var multer = require('multer')
var upload = multer({dest: 'uploads/'})

var Alunos = require('../../controllers/db_aplicacoes/alunos');
const TurmaOld = require('../../controllers/db_aplicacoes/turmasold');


router.get('/', passport.authenticate('jwt', {session: false}), function(req, res, next) {
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
router.get('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    Alunos.getAluno(req.params.id)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

/* GET devolve todos os registos de um jogo de um aluno. */
router.get('/:user/jogos/:jogoTable', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  Alunos.getJogosFromAluno(req.query.dataInicio, req.query.dataFim, req.query.jogoTipo, req.params.jogoTable, req.params.user)
             .then(dados =>{
               res.jsonp(dados)
             })
             .catch(erro => res.status(500).jsonp(erro))
});

/* GET devolve as estatisticas gerais de um jogo de um aluno. */
router.get('/:user/jogosGlobal/:jogoTable', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  Alunos.getJogosGlobalFromAluno(req.query.dataInicio, req.query.dataFim, req.query.jogoTipo, req.params.jogoTable, req.params.user)
             .then(dados =>{
               res.jsonp(dados)
             })
             .catch(erro => res.status(500).jsonp(erro))
});

/* PUT altera a informação de um aluno. */
router.put('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    Alunos.updateAluno(req.params.id, req.body)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});


/* PUT altera a escola de um aluno. */
router.put('/:id/escola', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  Alunos.updateTurma(req.params.id, req.body.turma)
             .then(dados =>{
                  //TurmaOld.insertTurmaOld()
                  res.jsonp(dados)
             })
             .catch(erro => res.status(500).jsonp(erro))
});

/* PUT altera a turma de um aluno. */
router.put('/:id/turma', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    Alunos.updateTurma(req.params.id, req.body.turma)
               .then(dados =>{
                    //TurmaOld.insertTurmaOld()
                    res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

/* PUT altera a password de um aluno. */
router.put('/:id/password', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  Alunos.updateTurma(req.params.id, req.body.password)
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
router.post('/csv', passport.authenticate('jwt', {session: false}), upload.single('ficheiro'), function(req, res, next) {
    let path = __dirname + '/../../'+req.file.path    
    let alunos = []
    let erros = []
    let i = 1;
    var stringfile = fs.readFileSync(path).toString()
    var delimiter = CSV.detect(stringfile)

    fs.createReadStream(path)
      .pipe(fastcsv.parse({ headers: ['user', 'numero', 'nome', 'datanascimento', 'escola', 'turma', 'email', 'password', 'codprofessor', 'pais'], delimiter:delimiter }))
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
      .on('end', rowCount => {
        for(var i = 0; i < alunos.length; i++){
          var aluno = alunos[i]
          Alunos.insertAluno(aluno)
        }
        res.jsonp('Foram inseridos ' + alunos.length + ' alunos.\nHouve ' + erros.length + ' erros por faltarem colunas por preencher.')
        
      });
  
});

/* DELETE apaga um aluno. */
router.delete('/:codigo', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    Alunos.apagar(req.params.codigo)
               .then(dados =>{
                 res.jsonp(dados)
               })
               .catch(erro => res.status(500).jsonp(erro))
});

module.exports = router