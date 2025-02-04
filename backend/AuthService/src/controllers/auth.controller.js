import { generateToken } from '../lib/utils.js'
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export const signup = async (req, res) => {
    const {fullName, email, password} = req.body;
    try {
        if(password.length < 6) {
            return res.status(400).json({message: "Password must be more than 6 characthers"});
        }

        if(!fullName || !email || !password){
            return res.status(400).json({message: "All fields must be provided"})
        }

        const user = User.findOne(email);

        if(user) {
            return res.status(400).json({message: "User already exists"})
        }

        const salt = bcrypt.genSalt(20);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        if(newUser){
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email
            })
        }

        else {
            return res.status(400).json({ message: "Invalid user data" });
        }


    } catch (error) {
        console.error('Error in signup | auth controller', error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        if(!email, !password) {
            return res.status(400).json({message: "All field must be provided"});        
        }

        const user = await User.findOne({email});

        if(!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = bcrypt.compare(password, user.hashedPassword);

        if(!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentails" });
        }

        generateToken(user._id, res);

        res.status(400).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
        })
    } catch (error) {
        console.error('Error in login | auth controller', error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const updateProfile = async (req, res) => {
    const {fullName, email, password} = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (password && password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        if (fullName) {
            user.fullName = fullName;
        }

        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: "Email is already in use" });
            }
            user.email = email;
        }

        if (password) {
            user.hashedPassword = await bcrypt.hash(password, 10);
        }

        await user.save();

        res.status(200).json({ 
            message: "Profile updated successfully",
            user: { 
                fullName: user.fullName,
                email: user.email
            } 
        });
    } catch (error) {
        console.error('Error in updateProfile | auth controller', error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message: "Logged out successfuly"});
    } catch (error) {
        console.error('Error in logout | auth controller', error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.error("Error in checkAuth | auth controller", error.message);
        res.status(500).json({ message:"Internal server error" });
    }
}

export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        const resetToken = crypto.randomBytes(32).toString("hex");  
        const hashedToken = await bcrypt.hash(resetToken, 10);
        user.resetToken = hashedToken;
        user.resetTokenExpires = Date.now() + 3600000; // + 1 hour
        await user.save();

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth:{
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Password Reset",
            text: `Use this token to reset your password: ${resetToken}`
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "Reset token sent to email" });
    } catch (error) {
        console.error('Error in requestPasswordReset | auth controller', error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

export const resetPassword = async (req, res) => {
    const { resetToken, newPassword } = req.body;
    try {
        const user = await User.findOne({ resetToken: { $exists: true } });

        if (!user || !user.resetTokenExpires || user.resetTokenExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        const isValid = await bcrypt.compare(resetToken, user.resetToken);
        if (!isValid) return res.status(400).json({ message: "Invalid token" });

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = null;
        user.resetTokenExpires = null;
        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.error('Error in resetPassword | auth controller', error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

export const changeRole = async (req, res) => {
    const {_id, role} = req.body
    try {
        if(!_id || !role) {
            return res.status(400).json({ message: "All field must be provided" });
        }

        const user = await User.findById(_id)

        if(!user) {
            return res.status(404).json({ message: "User not found" });
        } 

        user.role = role;
        await user.save();
        
        res.status(200).json({ message: "Role granted" });
    } catch (error) {
        console.error('Error in changeRole | auth controller', error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}