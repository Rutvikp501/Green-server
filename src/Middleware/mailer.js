const nodemailer = require("nodemailer")
const handlebars = require("handlebars")
const fs = require("fs")
const path = require("path")
const createuserTemplate = fs.readFileSync(path.join(__dirname, "../view/email/logincreate.hbs"), "utf8")
const otpTemplate = fs.readFileSync(path.join(__dirname, "../view/email/otp.hbs"), "utf8")

var smtpTransport  = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'desigreens501@gmail.com',
        pass: 'Desigreens@501'
    },
  });
//   var smtpTransport =nodemailer.createTransport({
//     service:"gmail",
//     auth:{
//         user:"desigreens501@gmail.com",
//         pass:"Desigreens@501"
//     },
//   });

function mailsend(email,htmlToSend,title)
{
    const mailOptions = {
        from: "desigreens501@gmail.com",
        to: email,
        subject: title,
        html: htmlToSend
      }
    
     return smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
          console.log(error)
          //return false;
        } else {
          console.log("Successfully sent email.")
         // return true
        }
      })
}

async function createmail(name,password,email)
{
  const template = handlebars.compile(createuserTemplate)
  const htmlToSend = template({name:name,email:email,password:password,name:name})
  let title="Account Details";
  mailsend(email,htmlToSend,title);
 
}

async function otpmail(name,login,otp,email)
{
  const template = handlebars.compile(otpTemplate)
  const htmlToSend = template({name:name,login:login,otp:otp,name:name})
  let title="Change Password OTP";
  mailsend(email,htmlToSend,title);
 
}

module.exports = {
    createmail:createmail,
    otpmail:otpmail
  };
  