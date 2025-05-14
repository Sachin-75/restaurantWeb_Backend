const userModel = require("../models/authModel");
const resetPassModel = require("../models/resetPassModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
    secure: true,
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const login = async (req, res) => {
    const {email,password} = req.body;
    console.log("email and pass===>",email,password)
    try {
        const user = await userModel.findOne({email});
        console.log("user from login",user)
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

const forgetpass = async (req, res) => {
    const user_email = req.body.email;
    console.log("from backend==>", user_email);

    try {
        const user = await userModel.findOne({ email: user_email });
        console.log("user from backend==>", user);

        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }

        const token = crypto.randomBytes(32).toString("hex");
        const hashToken = await bcrypt.hash(token, 10);

        await resetPassModel.deleteMany({ userId: user._id });

        const newReset = new resetPassModel({
            userId: user._id,
            reset_token: token  
        });

        await newReset.save();

        const resetLink = `${process.env.CLIENT_URL}/resetPass/${token}`;
        await transporter.sendMail({
            to: user.email,  
            subject: "QR Generator Forget Password Link",
            html: `
                <h1>Click the link below to reset password</h1>
                <a href="${resetLink}">${resetLink}</a> `
        });

        res.json({ success: true, msg: "Reset password link sent to your email", reset_link: resetLink });

    } catch (error) {
        console.log("Forget pass error:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}


const resetPass = async (req, res) => {
    const { token } = req.params;
    const password = req.body.password;
    console.log("reset from backend", token, password);

    try {
        const resetToken = await resetPassModel.findOne({ reset_token: token });
        console.log("resetToken", resetToken);

        if (!resetToken) {
            return res.json({ reset: "1", msg: "Invalid or Expired Link" });
        }

        const salt = await bcrypt.genSalt(10);
        const upass = await bcrypt.hash(password, salt);

        const updatedUser = await userModel.findOneAndUpdate(
            { _id: resetToken.userId },
            { $set: { password: upass } },
            { new: true }
        );

        await resetPassModel.deleteMany({ reset_token: token });

        res.json({ reset: "0", msg: "Your password updated successfully" });
    } catch (error) {
        console.error("Reset error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



module.exports = { login, register, forgetpass, resetPass };
