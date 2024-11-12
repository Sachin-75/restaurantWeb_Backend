const userModel = require("../models/authModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");

const login = async (req, res) => {
    const {email,password} = req.body;
    try {
        const user = await userModel.findOne({email});
        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }
        
        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            return res.json({ success: false, message: "Invalid Credential" });
        }
        

        const token = createToken(user._id);
        res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:"Internal Server Error"});
    }
};
//process.env.JWT_SECRET
const createToken = (userId) => {
    return jwt.sign(
        { id: userId}, 
        process.env.JWT_SECRET,
        { expiresIn: '1h' }  
    );
};




const register = async (req, res) => {
    const { name, password, email } = req.body; 
    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User Already Exists" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) { 
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword 
        });

        const user = await newUser.save();
        
        
        res.json({
            success: true,
            message: "User Created Successfully",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Internal Server Error" });
    }
};


module.exports = { login, register };
