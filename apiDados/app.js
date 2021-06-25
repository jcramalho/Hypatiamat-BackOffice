var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport')
var JWTStrategy= require('passport-jwt').Strategy
var ExtractJWT = require('passport-jwt').ExtractJwt
var swaggerJsdoc = require("swagger-jsdoc")
var cors = require('cors')
var swaggerUi = require("swagger-ui-express");
var yaml = require('js-yaml')
var fs = require('fs')
var yamlinc = require('yaml-include');

var secret = 'tese-hypatiamat2020'



var professoresRouter = require('./routes/aplicacoes/professores');
var codigosRouter = require('./routes/aplicacoes/codigosprof');
var turmasRouter = require('./routes/aplicacoes/turmas')
var escolasRouter = require('./routes/aplicacoes/escolas')
var alunosRouter = require('./routes/aplicacoes/alunos')
var examesRouter = require('./routes/aplicacoes/exames')
var loginRouter = require('./routes/aplicacoes/login')
var quarentenasRouter = require('./routes/aplicacoes/quarentena')
var jogosRouter = require('./routes/samd/jogos')
var appsRouter = require('./routes/testeconhecimentos/apps')
var campeonatosRouter = require('./routes/testeconhecimentos/campeonatos')
var cromosRouter = require('./routes/testeconhecimentos/cromos')
var comunidadesRouter = require('./routes/aplicacoes/comunidades');
var novidadesRouter = require('./routes/aplicacoes/novidades');
var trofeusRouter = require('./routes/testeconhecimentos/trofeus');
var mensagensRouter = require('./routes/aplicacoes/mensagens');
var emailsRouter = require('./routes/aplicacoes/email');
var appstarefasRouter = require('./routes/testeconhecimentos/appstarefas');


var extractFromQS = function(req){
  var token = null
  if(req.query && req.query.token) token = req.query.token
  return token
}

var extractFromBody = function(req){
  var token = null
  if(req.body && req.body.token) token = req.body.token
  return token
}

passport.use(new JWTStrategy({
  secretOrKey: secret,
  jwtFromRequest:ExtractJWT.fromExtractors([extractFromQS,extractFromBody]),
  passReqToCallback: true
}, async (req,payload,done) =>{
  try{
    return done(null,payload)
  }
  catch(error){
    return done(error)
  }
}))


var app = express();

const corsOpts = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Accept', 'Authorization', 'Cache-Control', 'Content-Type', 'DNT', 'If-Modified-Since', 'Keep-Alive', 'Origin', 'User-Agent', 'X-Requested-With', 'Content-Length']
}
app.use(cors(corsOpts))


yamlinc.setBaseFile(path.join(__dirname, 'swagger', 'index.yaml'));

var src = fs.readFileSync(yamlinc.basefile, 'utf8');

var swaggerDocument = yaml.load(src, { schema: yamlinc.YAML_INCLUDE_SCHEMA, filename: yamlinc.basefile })

var optionsSwagger = {
  explorer: true,
  customCss: '.swagger-ui .models { display: none }'
};



app.use(passport.initialize());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/swagger-ui-dist')));


app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, optionsSwagger)
);

app.use('/aplicacoes/professores', professoresRouter);
app.use('/aplicacoes/codigos', codigosRouter);
app.use('/aplicacoes/turmas', turmasRouter)
app.use('/aplicacoes/escolas', escolasRouter)
app.use('/aplicacoes/alunos', alunosRouter)
app.use('/aplicacoes/exames', examesRouter)
app.use('/aplicacoes/login', loginRouter)
app.use('/aplicacoes/quarentenas', quarentenasRouter)
app.use('/jogos', jogosRouter)
app.use('/apps', appsRouter)
app.use('/apps/tarefas', appstarefasRouter)
app.use('/campeonatos', campeonatosRouter)
app.use('/trofeus', trofeusRouter)
app.use('/cromos', cromosRouter)
app.use('/aplicacoes/comunidades', comunidadesRouter)
app.use('/aplicacoes/novidades', novidadesRouter)
app.use('/aplicacoes/mensagens', mensagensRouter)
app.use('/aplicacoes/emails', emailsRouter)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  if(err.status == '404') res.send('Error 404: Request not found.')
  else res.send('error');
});

module.exports = app;
