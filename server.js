const express = require('express');
const db = require('./config/db');
// const jwt = require('jsonwebtoken');

const app=express();

app.use(express.json());

//routes

// app.use('/customer', require('./routes/customerRoutes'));
app.use('/', require('./routes/AuthenRoutes'));


//sample api 
app.get('/test', (req, res)=>{
     res.status(200).send('hello world');
})

//conditionally listen
db.query('SELECT 1').then(()=>{
    
    console.log("db connected")
    
    //listen
    app.listen(5050, ()=>{
        console.log("running experss server 5050.....")
    })
}).catch((error)=>{
    console.log(error);
})

