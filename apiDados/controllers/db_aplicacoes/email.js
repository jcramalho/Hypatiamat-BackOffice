const Email = module.exports
const authEmail = require('../../config/authEmail').auth
const emailSolicitacao = require('../../config/authEmail').emailSolicitacao
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,  
    service: 'Gmail',
    auth: authEmail
});

var fromHypatia = {
  name: 'Hypatiamat',
  address: authEmail.user
}

Email.sendEmail=  async function(senderNome, destinatarios, texto){
    var fromProf = {
      name: senderNome,
      address: authEmail.user
    }
    var mailOptions = {
      from: fromProf,
      to: destinatarios,
      subject: 'Hypatiamat',
      text: texto
    };
    let info = await transporter.sendMail(mailOptions)
                                .catch(error => console.log(error))
    console.log(info.response)
    return 'Email enviado.'
}

Email.sendEmailRegisto = async function(assunto, texto){
  var email = {
    from: fromHypatia,
    to: fromHypatia.address,
    subject: assunto,
    text: texto
  };
  let info = await transporter.sendMail(email)
                              .catch(error => console.log(error))
  console.log(info.response)
  return 'Email enviado.'
}

Email.sendEmailSolicitacaoCodigo = async function(agrupamento, nomeProf, emailProf){
  var email = {
    from: fromHypatia,
    to: emailSolicitacao,
    subject: 'Pedido de Código de Confirmação',
    text: 'O seguinte professor está a solicitar um código de confirmação para se registar na plataforma:\n' +
        '   Agrupamento de Escolas: ' + agrupamento + '\n   Nome do professor: ' + nomeProf + "\n   Email do professor: " +
        emailProf
  }

  let info = await transporter.sendMail(email)
                              .catch(error => console.log(error))
  console.log(info.response)
  return 'Email enviado.'
}
