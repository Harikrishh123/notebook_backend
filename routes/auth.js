const express = require("express");
const User = require("../models/User");

const { body, validationResult } = require('express-validator');

const router = express.Router();

const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/Fetchuser")
//Router 1 : Creating a user

router.post('/signup' , [
    body('name', "Reenter your name").isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 })
], async (req,res)=>{

    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

   try {
    
  let user = await User.findOne({email : req.body.email})
  if(user){
    return res.status(400).json({error : "A user with this email already exixts"});
  }
   const salt = await bcrypt.genSalt(10)
  const secPassword = await bcrypt.hash(req.body.password, salt)

   user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: secPassword,
})

const JWT_SECRET = 'hariisagoodboy';
const data = {
    user : {
        id : user.id,
    }
}
const authToken = jwt.sign(data, JWT_SECRET);
 
success = true;
res.send({success, authToken})
} catch (error) {
    console.log(error.message);
    res.status(500).send("Error occured somewhere")
}
    
})


//Route 2 : User login  route

router.post('/signin' , [
    body('email', "Please enter a  valid email").isEmail(),
    body('password', "password should not be blank").exists(),
], async (req,res)=>{
   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
   try {
    let success = false ;
    let user = await User.findOne({email : req.body.email})
  if(!user){
    return res.status(400).json({error : "Please enter valid credentials"});
  }

  const compare = await bcrypt.compare(req.body.password, user.password);

  if(!compare){
    return res.status(400).json({error : "Please enter valid credentials"});
  }
  
  const JWT_SECRET = 'hariisagoodboy';
const data = {
    user : {
        id : user.id,
    }
}
const authToken = jwt.sign(data, JWT_SECRET);

 success = true;
 let pass = req.body.password
 
res.send({success, authToken, pass})

   } catch (error) {
    console.log(error.message);
    res.status(500).send("Error occured somewhere")
}
    

})

//Route 3 : Providing data of the user

router.post('/userdata', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id ;
    const user = await User.findById(userId).select("-password");
    res.send(user);
    } catch (error) {
        res.status(401).send({error : "Please do a valid authentication"})
    }
})



module.exports = router