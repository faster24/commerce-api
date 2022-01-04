const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

//register user

router.post( '/register' , async ( req , res ) => {
    const user = req.body;
  

    const newUser = new User({

        username: user.username,
        email: user.email,
        password: CryptoJS.AES.encrypt(
                        user.password ,
                        process.env.SECRET_KEY ).toString(),
    
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json(error);
    }
    
    
})

//login user

router.post( '/login' , async ( req , res ) => {
    
    const request = req.body;

    try {
        
        const user = await User.findOne({ username: request.username });
       
        const hash = CryptoJS.AES.decrypt( user.password , process.env.SECRET_KEY );
        const password = hash.toString(CryptoJS.enc.Utf8);

        if(!user|| password !== request.password) {
            res.status(401).json("Wrong credentials!");
        } else {

            const accessToken = jwt.sign({
                id: user._id,
                isAdmin: user.isAdmin,   
            } , process.env.JWT_SECRET_KEY , { expiresIn: "3d"} ); 

            const { password , ...others } = user._doc;
            res.status(200).json({ ...others , accessToken});
        } 
        
    } catch (error) {
        console.log(error);
    }
}) 

module.exports = router;