const path = require("path");
const userSchema = require("../schemas/userSchema");
const { error } = require("console");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer")
const OtpSchema =  require('../schemas/otp')
const sendMail =  require('../Mailer/mail')
// const privateKey = require("keysecurity")

exports.regForm = (req, res) => {
  // let root =path.dirname("")

  res.send(`
        <html>
        <head><title>Reg. Form</title></head>
        <body>
        <form method="POST"  action="/result" >
        <input name="n1"   placeholder="Enter First Number" >
        <input  name="n2" placeholder="Enter Second Number" >
        <input type="password"  name="pass" placeholder="Enter your password" >
        <button>Submit</button>
        </form>
        </body>
        </html>
    `);
};



exports.getForm  = (req,res) =>{

  userSchema.find({}).then((result)=>{
      var temp = ""
  
  
      for(let i = 0 ; i < result.length ; i++)
      {
          temp  = temp + `
          <tr>
          <td>${i+1}</td>
          <td>${result[i].name}</td>
          <td>${result[i].email}</td>
          <td>${result[i].mobile}</td>
          <td><button onclick="" >Delete User</button></td>
          </tr>`
      }
  
      res.send(`<html>
  <head>
      <title>REG Form</title>
      <style>
  table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }
  td, th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
  }
  tr:nth-child(even) {
    background-color: #dddddd;
  }
  </style>
  </head>
  <body>
      
      <form method="POST" action="/user/user-register" >
          <input name="name" placeholder="Enter your Name"  />
          <input name="mobile" placeholder="Enter your Mobile"  />
          <input name="email" placeholder="Enter your Email"  />
          <input name="password" placeholder="Enter your Password"  />
          <h1 id='sp' ></h1>
          <button>Submit</button>
          <table   >
          <tr>
          <th>Sr. No</th>
          <th>Name</th>
          <th>Email</th>
          <th>Mobile</th>
          </tr>
          ${temp}
          </table>
      </form>
  </body>
  </html>`)
  
  })    
  }



  exports.uploadFile = (req,res)=>{
    console.log(req.body)
    
        userSchema.find({_id : req.body.id}).then((result)=>{
            console.log(result)
            if(result.length == 0)
            {
                res.status(400).send({status : 400 , message : "User Not Found"})
            }else
            {
               userSchema.updateOne({_id : req.body.id} , {$set : {profile_pic : `http://localhost:8765/static/${req.file_name}`}}).then((u_result)=>{
                if(u_result.matchedCount == 1)
                                        {
                                            res.status(200).send({status : 200 ,  message : "Profile Updated Successfully"})
                                        }
                                        else
                                        {
                                            res.status(404).send({status : 404 ,  message : "Profile Not Updated"})
    
                                        }
                                    }).catch((err)=>{
                                        res.status(500).send({status : 500 , message : "Something Went Wrong"})
                                    })
    
            }
        }).catch((err)=>{
            console.log(err)
            res.status(400).send({status : 400 , message : "Somthing Went Wrong"})
        })
    
    
    }


    exports.verifyOtp = (req,res) =>{


      userSchema.find({email : req.body.email}).then((result1)=>{
        if(result1.length  == 0)
        {
            res.status(400).send({status :  400 , message : "User Not Found"})
        }
        else
        {
            OtpSchema.find({id :  result1[0]._id}).then((result2)=>{
                if(req.body.otp == result2[0].otp)
                {

                    var d = new Date();
                    console.log("*****************************")
                    console.log((d.getTime()  - result2[0].time) / 1000 )
                    console.log((d.getTime()  - result2[0].time) / 1000 > 40)
                    console.log("*****************************")

                    if((d.getTime()  - result2[0].time) / 1000 > 40   ){

                        res.status(400).send({status : 400 , messahe : "OTP has expired !! Please Generate a new OTP"})

                    }
                    else
                    {
                        bcrypt.genSalt(10, function(err,salt){
                            if(err){
                            res.status(500).send({status :  500 , message : "Somenthing Went Wrong"})

                            }else
                            {
                                bcrypt.hash(req.body.newPassword ,  salt , function(err, hash){
                                    if(err){
                                        res.status(500).send({status :  500 , message : "Somenthing Went Wrong"})

                                    }
                                    else{
                                        userSchema.updateOne({_id :result1[0]._id  } , {$set : {password :  hash}}).then((up_result)=>{

                                            if(up_result.matchedCount == 1)
                                            {
                                                OtpSchema.deleteOne({id: result1[0]._id}).then((dl_result)=>{
                                                    if(dl_result.deletedCount == 1)
                                                    {
                                                        res.status(200).send({status : 200 , message : "Password Reset Successfully :)"})
                                                    }
                                                    else
                                                    {
                                                        res.status(500).send({status :  500 , message : "Somenthing Went Wrong"})

                                                    }

                                                }).catch((err)=>{
                            res.status(500).send({status :  500 , message : "Somenthing Went Wrong"})

                        })
                                            }
                                            else
                                            {

                                                res.status(500).send({status :  500 , message : "Somenthing Went Wrong"})

                                            }

                                        }).catch((err)=>{
                            res.status(500).send({status :  500 , message : "Somenthing Went Wrong"})

                        })
                                    }
                                }) 
                            }
                        })

                    }

                        // OtpSchema.deleteOne({id :  result1[0]._id}).then((d_result)=>{
                        //     if(d_result.deletedCount == 1)
                        //     {

                        //     }
                        // }).catch((err)=>{
                        //     res.status(500).send({status :  500 , message : "Somenthing Went Wrong"})

                        // })
                }
                else
                {
                    res.status(400).send({status : 400 , message : "Inavlid OTP"})
                }
            }).catch((err)=>{
                res.status(500).send({status :  500 , message : "Somenthing Went Wrong"})

            })
        }
    }).catch((err)=>{
        res.status(500).send({status :  500 , message : "Somenthing Went Wrong"})

    })

    }
    
    exports.resetPasswordByOtp = (req,res)=>{
      let d =  new Date();
        let otp = Math.floor(Math.random() * 4567)
    
        userSchema.find({email : req.body.email}).then((result)=>{
            if(result.length == 0)
            {
                res.status(400).send({status : 400 , message : "User Not Found"})
            }
            else{
              sendMail(result[0].email ,  otp)
              OtpSchema.insertMany({id : result[0]._id , otp  : otp }).then((o_result)=>{
                    res.status(200).send({status : 200 ,  message : "OTP Send Successfully" })
                }).catch((err)=>{
                    res.status(500).send({status :  500 , message : "Somenthing Went Wrong"})
                })
            }
        }).catch((err)=>{
            res.status(500).send({status :  500 , message : "Somenthing Went Wrong"})
        })
    
    }





exports.showResult = (req, res) => {
  console.log(req.body);
  var sum = parseInt(req.body.n1) + parseInt(req.body.n2);
  res.send(`Sum of ${req.body.n1} &n ${req.body.n2} = ${sum}`);
};

exports.register = (req, res) => {
  const { name, email, mobile, password } = req.body;

  if (!password) {
    res.status(400).send({ status: 400, message: "Password is Required" });
  } else {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        res.status(500).send({ status: 500, message: "Something Went Wrong" });
      } else {
        bcrypt.hash(password, salt, function (err, hash) {
          if (err) {
            res
              .status(500)
              .send({ status: 500, message: "Something Went Wrong" });
          } else {
            userSchema
              .insertMany({
                name: name,
                email: email,
                mobile: mobile,
                password: hash,
              })
              .then((result) => {
                console.log(result);
                res.status(200).send({ status: 200, message: "User Created Successfully" });
                res.redirect("/user")
              })
              .catch((err) => {
                if (err.name == "ValidationError") {
                  res.status(400).send({
                    status: 400,
                    message: `${err.message
                      .split(":")[1]
                      .trim()} Cannot be Empty ): `,
                  });
                } else if (err.name == "MongoBulkWriteError") {
                  let key = err.message.split(":")[3].replace("{", "").trim();
                  let value = err.message.split(":")[4].replace("}", "").trim();
                  res.status(409).send({
                    status: 409,
                    message: `User , with this ${key} (${value}) already exists ):`,
                  });
                } else {
                  res.status(500).send({
                    status: 500,
                    message: "Something Went Wrong",
                    err: err,
                  });
                }
              });
          }
        });
      }
    });
  }
};

exports.login = (req, res) => {
  // const { email, password } = req.body;
   // user['token'] =  token
    // res.status(200).send(user)
    const {email  ,password}  = req.body
    var token  =  jwt.sign({ email:  email} , process.env.PRIVATE_KEY  ,{ expiresIn: "50s" } )
  if (!email || !password) {
    res
      .status(400)
      .send({ status: 400, message: "Email & Password is Required" });
  } else {
    userSchema
      .find({ email: email })
      .then((result) => {
        console.log(result)
        if (result.length > 0) {
          bcrypt.compare(password, result[0].password, function (err, auth) {
            if (err) {
              res
                .status(500)
                .send({ status: 500, message: "Something Went Wrong" });
            } else {
              const { name, email, mobile, _id } = result[0];
              if (auth == true) {
                // res.status(200).send({
                //   status: 200,
                //   message: "User Login Successfully",
                //   data: { id: _id, name: name, email: email, mobile: mobile },
                // });


                                    // res.status(200).send({status : 200 , message : "User Login Successfully" , data: { id : _id, name: name , email:email ,  mobile :mobile}})
                                    userSchema.updateOne({_id : _id } , {$set : {token  :  token}}).then((u_result)=>{
                                      if(u_result.matchedCount == 1)
                                      {
                                      res.status(200).send({status : 200 , message : "User Login Successfully" , data: { id : _id, name: name , email:email ,  mobile :mobile , token : token}})

                                      }
                                      else
                                      {

                                          res.status(500).send({status : 500 ,  message : "Something went wrong !! please try again ):"})

                                      }
                                  }).catch((err)=>{

                                      res.status(500).send({status : 500 ,  message : "Something went wrong !! please try again ):"})


                                  })
              } else {
                res
                  .status(401)
                  .send({ status: 401, message: "Incorrect Password" });
              }
            }
          });
        } else {
          res.status(404).send({ status: 404, message: "User not found" });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ status: 500, message: "Soemthing Went Wrong" });
      });
  }
};

exports.getAllUsers = (req, res) => {
  userSchema
    .find({})
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).send({ status: 500, message: "Something Went Wrong" });
    });
};

exports.updateUserEmail = (req, res) => {
  const { id, email } = req.body;
  userSchema
    .updateOne({ _id: id }, { $set: { email: email } })
    .then((result) => {
      console.log(result);
      if (result.matchedCount == 1) {
        res.status(200).send({ status: 200, message: "Updated Successfully" });
      } else {
        res.status(404).send({ status: 404, message: "Not Updated" });
      }
    })
    .catch((err) => {
      res.status(500).send({ status: 500, message: "Something Went Wrong" });
    });
};


exports.changePassword = (req, res) => {
  const { id, o_pass, n_pass, c_pass } = req.body;

  if (n_pass !== c_pass) {
    res.status(400).send({ status: 400, message: "Passowrd didn't Match" });
  } else {
    userSchema
      .find({ _id: id })
      .then((result) => {
        bcrypt.compare(o_pass, result[0].password, function (err, auth) {
          if (err) {
            res
              .status(500)
              .send({ status: 500, message: "Something Went Wrong" });
          } else {
            if (auth == false) {
              res
                .status(401)
                .send({ status: 401, message: "Old Password didn't macth" });
            } else {
              bcrypt.genSalt(10, function (err, salt) {
                if (err) {
                  res
                    .status(500)
                    .send({ status: 500, message: "Something Went Wrong" });
                } else {
                  bcrypt.hash(n_pass, salt, function (err, hash) {
                    if (err) {
                      res
                        .status(500)
                        .send({ status: 500, message: "Something Went Wrong" });
                    } else {
                      userSchema
                        .updateOne({ _id: id }, { $set: { password: hash } })
                        .then((u_res) => {
                          if (u_res.matchedCount == 1) {
                            res
                              .status(200)
                              .send({
                                status: 200,
                                message: "Password Updated Successfully",
                              });
                          } else {
                            res
                              .status(404)
                              .send({
                                status: 404,
                                message: "Password Not Updated",
                              });
                          }
                        })
                        .catch((err) => {
                          res
                            .status(500)
                            .send({
                              status: 500,
                              message: "Something Went Wrong",
                            });
                        });
                    }
                  });
                }
              });
            }
          }
        });
      })
      .catch((err) => {
        res.status(500).send({ status: 500, message: "Something Went Wrong" });
      });
  }
}


exports.deleteUser  = (req,res) =>{
  const {id } =  req.body

  userSchema.deleteOne({_id : id }).then((result)=>{
      console.log(result)
      if(result.deletedCount == 1)
      {

          res.status(202).send({status : 202 , message : "Deleted Successfully"})
      }
      else
      {

          res.status(409).send({status : 409 , message : "Not Deleted !! Try Again"})
      }
  }).catch((err)=>{
      console.log(err)
      res.status(500).send({status : 500 , message : "Something Went Wrong!!"})

  })
}




exports.dummyLogin = (req,res)=>{

  const  user = {
      name : "Bhanu",
      mobile : "9549339982",
      email : "bhanu@gmail.com",
      password : "1234"
  }
  var token  =  jwt.sign({ email :  user.email} , process.env.PRIVATE_KEY  ,{ expiresIn: "180s" } )
  user['token'] =  token
  res.status(200).send(user)

}


exports.ValidateToken = (req,res , next) =>{
  console.log(req.headers)
  const {token} = req.headers;

  jwt.verify(token , process.env.PRIVATE_KEY  , function(err ,auth){
      if(err)
      {
          console.log(err)

          if(err.name  == "TokenExpiredError")
          {
              res.status(401).send({ status:401 , message :  "Your Token has been expired"})

          }
          else if(err.name == "JsonWebTokenError")
          {
              res.status(401).send({ status:401 , message :"Your Token Invalid"})

          }
          else
          {
              res.status(500).send({ status:500 , message :"Something Went Wrong"})

          }
      }
      else
      {
          userSchema.find({ email : auth.email}).then((f_result)=>{
              if(f_result.length > 0)
              {
                  next() 
              }
              else{
                  res.status(401).send({ status:401 , message :"Your Token Invalid"}) 
              }
          }).catch((err)=>{

              res.status(500).send({ status:500 , message :"Seomthing Went Wrong"})
          })


      }
  })



}


exports.checkOddEven = (req,res)=>{


  if(parseInt(req.body.num) % 2 == 0)
  {
      res.send("Even Number")
  }
  else
  {
      res.send("Odd Number")

  }

}



