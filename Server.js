const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const PORT = 8765
const MyRoutes = require('./Routes/Routes')
const AdminRoutes = require('./Routes/AdminRoutes')
const db = require("./DB/db");

require('dotenv').config()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended :  true}))

app.use("/static",express.static(__dirname+ '/uploads'));

// app.get("/", (req, res)=>{
//     res.sendFile(`${__dirname}/demo.html`)
// })

// app.post("/result", (req, res)=>{
    // console.log(req.query);
    // res.send("hii")

//     const num = parseInt(req.body.n1);
//     if (num%2==0){
//         res.send(`${num} is even number`)
//     }
//     else{
//         res.send(`${num} is Odd number`)
//     }

// })


app.use('/student' , MyRoutes)
app.use('/admin' , AdminRoutes)

app.listen( PORT ,  ()=>{
    console.log(`Server is running on PORT : ${PORT}`)
} )