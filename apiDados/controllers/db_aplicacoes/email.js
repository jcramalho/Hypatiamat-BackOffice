const Email = module.exports
const authEmail = require('../../config/authEmail').auth
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
    to: 'a82298@alunos.uminho.pt, lguilhermem@hotmail.com, luis15945@agvv.edu.pt',
    subject: assunto,
    text: texto
  };
  let info = await transporter.sendMail(email)
                              .catch(error => console.log(error))
  console.log(info.response)
  return 'Email enviado.'
}
