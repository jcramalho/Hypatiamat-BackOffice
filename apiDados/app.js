var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport')
var JWTStrategy= require('passport-jwt').Strategy
var ExtractJWT = require('passport-jwt').ExtractJwt
var swaggerJSDoc = require('swagger-jsdoc');
var swaggerUi = require("swagger-ui-express");



var professoresRouter = require('./routes/aplicacoes/professores');
var turmasRouter = require('./routes/aplicacoes/turmas')
var escolasRouter = require('./routes/aplicacoes/escolas')
var alunosRouter = require('./routes/aplicacoes/alunos')
var examesRouter = require('./routes/aplicacoes/exames')
var loginRouter = require('./routes/aplicacoes/login')



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
  secretOrKey: 'tese-hypatiamat2020',
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

app.use(passport.initialize());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// swagger definition
var swaggerDefinition = {
  info: {
    title: 'API Hypatiamat',
    version: '1.0.0',
    description: 'Aqui encontra-se a documentação de toda a api de dados do Hypatiamat, incluindo todas as rotas e toda a informação à cerca do que é precisar passar como parâmetros, bem como os resultados que se podem esperar ao executar aquela rota',
  },
  host: 'localhost:3050',
  basePath: '/',
  schemes: [
    "http"
  ],
  tags: [
    {
      name: "Alunos",
      description: "Todas as operações à cerca de alunos."
    },
    {
      name: "Professores",
      description: "Todas as operações à cerca de professores."
    },
    {
      name: "Escolas",
      description: "Todas as operações à cerca de escolas."
    },
    {
        name: "Turmas",
        description: "Todas as operações à cerca de turmas."
    }
  ],
  securityDefinitions:{
    bearerAuth:{
      type: "apiKey",
      in: "query",
      name: "token",
      scheme: "bearer"
    }
  }
};

// options for the swagger docs
var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./routes/aplicacoes/*.js'],
};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);

var swaggerDocument = require('./swagger.json');

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

app.use('/aplicacoes/professores', professoresRouter);
app.use('/aplicacoes/turmas', turmasRouter)
app.use('/aplicacoes/escolas', escolasRouter)
app.use('/aplicacoes/alunos', alunosRouter)
app.use('/aplicacoes/exames', examesRouter)
app.use('/aplicacoes/login', loginRouter)



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
  res.render('error');
});

module.exports = app;
