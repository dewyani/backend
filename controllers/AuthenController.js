const db = require("../config/db");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretKey='secretKey';

//SIGNUP
const signupUser = async (req, res) => {
    const { username, password ,email, role } = req.body;

    if (!username || !password || !email || !role) {
        
        return res.status(500).send({
            success:false,
            message:'please provide all fields'
    })
   }

    try {

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const [data]=await db.query(`INSERT INTO users (username, password, email, role) VALUES (?, ?,?, ?)`, [username, hashedPassword,email, role])

        if(!data)
                {
                        return res.status(500).send({
                        success:false,
                        message:'insert all values'
                    })
                }
    
                res.status(201).send({
                    "status" :' Account successfully created',
                    "status_code": '200',
                     "user_id": data.insertId
                })
    } catch(error){
        console.log(error)
        res.status(500).send(
            {
                success:false,
                message:'failed to register user',
                error
            }
        )
    }
};



//LOGIN
const loginUser = async (req, res)=>{

    try{
          //id
        const {username, password} = req.body

        if(!username || !password){
                return res.status(500).send({
                success:false,
                message:'please provide all fields'

                })
            }
            const [users]=await db.query(`SELECT * FROM users WHERE username=?`, [username])
            const user =users[0];

            if (!user) {
                return res.status(400).send({ error: 'Invalid username or password' });
            }

         
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).send({ error: 'Invalid username or password' });
            }


            jwt.sign({ id: user.user_id, username: user.username}, secretKey, {expiresIn: '300s'}, (err, token)=>{

                if(err){
                    return res.status(500).send({err:'failed to generate token'})
                }
                res.status(200).send({
                    "status": "Login succesfully",
                    "status_code": "200",
                    token:token,
                    "user_id": user.insertId
                })
            })

            
  }
  catch(error){
    console.log(error)
    res.status(500).send(
        {
            success:false,
            message:'failed to login user',
            error
        }
    )
}
}


//CREATE NEWS

const createShort = async (req, res)=>{

    try{
          
        const {category, title, author,publish_date , content, actual_content_link, image, upvote, downvote} = req.body


            const data=await db.query(`INSERT INTO shorts (category, title, author,publish_date , content, actual_content_link, image,  upvote, downvote ) VALUES (?, ?,?,?, ?,?, ?,?, ? )`, [category, title, author, publish_date ,content, actual_content_link, image,  upvote, downvote])
            
            if(!data)
                {
                        return res.status(404).send({
                        success:false,
                        message:'error in insert query'
                    })
                }
    
                res.status(201).send({
                    
                    message:'shorts added succesfully',
                    "short_id":data.insertId,
                    "status_code": 200
                })
  }
    catch(error){
        console.log(error)
        res.status(500).send(
            {
                success:false,
                message:'error in create shorts api',
                error
            }
        )
    }

}



module.exports= {signupUser, loginUser, createShort, };
