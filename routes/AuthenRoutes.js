const experss = require('express');
const { loginUser, signupUser, createShort } = require('../controllers/AuthenController');


//router object
const router = experss.Router()

//routes

//GET ALL cutstomers list || GET
//endpoint and callback function

router.post('/signup', signupUser);

router.post('/login', loginUser);

router.post('/create/short', createShort);

module.exports=router