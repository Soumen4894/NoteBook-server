const express = require('express');
const User = require('../Models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var fetchuser = require('../Middleware/fetchuser');
const JWT_SECRET = process.env.JWT_SECRET;

//Route 1
// create a user using: localhost:5000/api/auth/createuser
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
],
    async (req, res) => {
        let success = false;
        // console.log(req.body);
        // const user = User(req.body);
        // user.save();
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            success = false;
            return res.status(400).json({ success, errors: errors.array() });
        }
        try {

            let user = await User.findOne({ email: req.body.email });
            if (user) {
                success = false;
                return res.status(400).json({ success, error: "Sorry! a user with this email already exist" })
            }

            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt)
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass,
            })

            //   .then(user => res.json(user))
            //   .catch(err => {console.log(err)
            // res.json({error: "Enter a valid email", message: err.message})})
            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);
            // console.log(jwtData);
            // res.json(user);
            success = true;
            res.json({ success, authToken })
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error");
        }


    })
// Route 2
// Create an user using: localhost:5000/api/auth/login
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password can not be blank').exists(),
],
    async (req, res) => {
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            if (!user) {
                success = false
                return res.status(400).json({success, error: "Please try to login with correct credentials" });
            }
            const passwordCompare = await bcrypt.compare(password, user.password);
            if (!passwordCompare) {
                success = false;
                return res.status(400).json({ success, error: "Please try to login with correct credentials" });
            }
            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);
            success = true;
            res.json({ success, authToken })
        }
        catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error");
        }

    })

// Route 3
// Login routes: required login

router.post('/getuser', fetchuser, async (req, res) => {

    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router
//authtoken