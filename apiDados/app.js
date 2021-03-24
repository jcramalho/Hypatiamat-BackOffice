var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport')
var JWTStrategy= require('passport-jwt').Strategy
var ExtractJWT = require('passport-jwt').ExtractJwt
var swaggerJsdoc = require("swagger-jsdoc")
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
var comunidadesRouter = require('./routes/aplicacoes/comunidades');
var novidadesRouter = require('./routes/aplicacoes/novidades');
var trofeusRouter = require('./routes/testeconhecimentos/trofeus');
var mensagensRouter = require('./routes/aplicacoes/mensagens');




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

/*
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hypatiamat - API de Dados",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "LogRocket",
        url: "https://logrocket.com",
        email: "info@email.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3050",
      },
    ],
  },
  apis: ["./routes/aplicacoes/alunos.js"],
};

//const opts = { ...options, swaggerDefinition: options };


var specs = swaggerJsdoc(options);*/
yamlinc.setBaseFile(path.join(__dirname, 'swagger', 'index.yaml'));

var src = fs.readFileSync(yamlinc.basefile, 'utf8');

var swaggerDocument = yaml.load(src, { schema: yamlinc.YAML_INCLUDE_SCHEMA, filename: yamlinc.basefile })

var optionsSwagger = {
  explorer: true,
  swaggerOptions: {
    validatorUrl: null
  },
  customCss: '.swagger-ui .models { display: none }'
};

app.use(
  "/temp-api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, optionsSwagger)
);

app.use(passport.initialize());

const apiDocsRedirectPath = "/temp-api-docs/";
app.get('/api-docs', function(req, res) {
    res.redirect(apiDocsRedirectPath);
});

var cors = require('cors')
const corsOpts = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Accept', 'Authorization', 'Cache-Control', 'Content-Type', 'DNT', 'If-Modified-Since', 'Keep-Alive', 'Origin', 'User-Agent', 'X-Requested-With', 'Content-Length']
}
app.use(cors(corsOpts))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// swagger definition


/*
// options for the swagger docs
var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./routes/aplicacoes/*.js'],
};*/

// initialize swagger-jsdoc
//var swaggerSpec = swaggerJSDoc(options);

//var swaggerDocument = require('./swagger.json');

/*
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);*/

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
app.use('/campeonatos', campeonatosRouter)
app.use('/trofeus', trofeusRouter)
app.use('/aplicacoes/comunidades', comunidadesRouter)
app.use('/aplicacoes/novidades', novidadesRouter)
app.use('/aplicacoes/mensagens', mensagensRouter)



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
