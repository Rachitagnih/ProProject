const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const {JWT_SECRET} = require('../keys.js');
const requireLogin = require('../middleware/requireLogin.js');


router.get('/protected',requireLogin,(req, res) => {
    res.send("Welcome");
});

router.post('/signup', (req, res) => {
    const{name, email, password} = req.body;
    if(!email || !password || !name) {
        return res.status(404).json({error:"Please enter all the fields"});
    }
    // res.json({msg:"success"});
    // console.log(req.body);
    User.findOne({email: email})
    .then((savedUser) => {
        if(savedUser){
            return res.status(404).json({error:"User already exists"});
        }
        bcrypt.hash(password, 10)
        .then(hashedPassword => {
            const user = new User({
                name: name,
                email: email,
                password: hashedPassword
            });
    
            user.save()
            .then(user => {
                res.json({message:"User saved successfully"});
            })
            .catch(err => {
                console.log(err);
            });
        })
        
    })
    .catch((err) => {
        console.log(err);
    });
});


router.post('/login',(req, res) => {
    const{email, password} = req.body;
    if(!email || !password){
        return res.status(403).json({message: 'Please enter email and password'});
    }
    User.findOne({email: email})
    .then(savedUser => {
        if(!savedUser){
            return res.status(403).json({error : "Invalid email or password"});
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch => {
            if(doMatch){
                // res.json({message : "Successfully signed in!"});
                const token = jwt.sign({_id : savedUser._id},JWT_SECRET);
                const {_id, name, email} = savedUser;
                res.json({token, user:{_id,name,email}});
            }
            else{
                return res.status(403).json({error : "Invalid email or password"});
            }
        })
        .catch(err => {
            console.log(err);
        });
    })
    .catch(err => {
        console.log(err);
    });
});



module.exports = router;