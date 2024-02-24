var nodemailer = require('nodemailer');



async function sendMail(receiver,subject,body)
{
    const transporter = nodemailer.createTransport({
        host: "us2.smtp.mailhostbox.com",
        port: 587,
        secure: false,
        auth: {
          user: "uniconnect@uiuss.tech",
          pass: "CQ%nIrP6",
        },
      });
    
    var mailOptions = {
      from: {
        name: 'UniConnect',
        address: 'uniconnect@uiuss.tech'
    },
      to: receiver,
      subject: subject,
      html: body
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

module.exports = {
    sendMail,
}