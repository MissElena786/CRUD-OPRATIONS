const nodemailer = require('nodemailer')



const transporter =  nodemailer.createTransport({

    host : "smtp.gmail.com",

    port :  465,

    secure : true,

    auth : {

        user  : 'smtpt3600@gmail.com',

        pass : "iulxrgwusbpzqtux"

    }

})


const mailOptions =  {

    from : "smtpt3600@gmail.com",

    to : "",

    subject : "OPT for Password Reset",

    text : ""

}


async function sendMail(to , otp ){

    mailOptions['to'] =  to

    mailOptions['text'] =  `OTP to Generate New passord is : ${otp} `

    await transporter.sendMail(mailOptions , function(err  ,info){

        if(err){

            console.log(err)

        }else{

            console.log(info)

        }

    })

}

module.exports = sendMail