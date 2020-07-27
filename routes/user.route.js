const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const auth = require('../middleware/auth');

router.post('/user/register', (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then((hash) => {
        const user = new userModel({
            name: req.body.name,
            email: req.body.email,
            password: hash
        });

        user.save().then((response) => {
            res.status(201).json({message: "User successfully created!", result: response});
        }).catch(error => {
            res.status(500).json({error: error});
        })
    });
});

router.post('/user/login', (req, res, next) => {
    let getUser;
    userModel.findOne({ 
        email: req.body.email 
    }).then(user => {
        if (!user) {
            return res.status(401).json({message: "Authentication failed"});
        }
        getUser = user;
        return bcrypt.compare(req.body.password, user.password);
    }).then(response => {
        if (!response) {
            return res.status(401).json({message: "Authentication failed"});
        }
        let jwtToken = jwt.sign(
            {
                email: getUser.email,userId: getUser._id,
            }, 
            process.env.JWT_KEY, 
            {
                expiresIn: "1h"
            }
        );
        res.status(200).json({
            token: jwtToken,
            expiresIn: 3600,
            data: getUser
        });
    }).catch(error => {
        return res.status(401).json({message: "Authentication failed"});
    })
});

router.get('/user/me/:id', auth, (req, res, next) => {
    userModel.findById(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({result: data});
        }
    });
});
