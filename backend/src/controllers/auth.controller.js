import User from '../models/User.js';
import { sendWelcomeEmail } from '../emails/emailHandlers.js';
import { generateToken } from '../lib/utils.js';
import bcrypt from 'bcryptjs';
import { ENV } from '../lib/env.js';
import cloudinary from '../lib/cloudinary.js';


export const signup= async(req,res)=>{
    const {fullname,email,password}=req.body;
    console.log("Received signup data:", {fullname, email, password: password ? "[HIDDEN]" : undefined});

    try{
        if(!fullname || !email || !password){
            console.log("Validation failed - missing fields:", {fullname: !!fullname, email: !!email, password: !!password});
            return res.status(400).json({message:"All fields are required"});
        }
        if(password.length<6){
            return res.status(400).json({message:"Password must be at least 6 characters"});
        }

        // Check if user already exists
        const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({message:"Invalid email format"});
        }

        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message:"User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            fullname,
            email,
            password:hashedPassword
        });

        if(newUser){
            
            const savedUser = await newUser.save();
            generateToken(savedUser._id,res);

            res.status(201).json({
                _id:newUser._id,
                fullname:newUser.fullname,
                email:newUser.email,
                profilePic:newUser.profilePic,
            });
            //todo: send welcome email
            try{
                await sendWelcomeEmail(savedUser.email,savedUser.fullname,ENV.CLIENT_URL);
            }catch(err){
                console.log("Error sending welcome email :",err);
            }
        }else{
            res.status(400).json({message:"Invalid user data"});
        }
    }catch(err){
        console.log("Error in signup controller :",err);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const login= async(req,res)=>{
    const {email,password}=req.body;

    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid email or password"});
        }

        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid email or password"});
        }

        generateToken(user._id,res);

        res.status(200).json({
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            profilePic:user.profilePic,
        });
    }catch(err){
        console.log("Error in login controller :",err);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const logout= async(_,res)=>{
    res.cookie("jwt", "", {maxAge:0});
    res.status(200).json({message:"Logged out successfully"});
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!profilePic) {
            return res.status(400).json({ message: "Profile picture is required" });
        }

        let uploadedUrl;
        try {
            const uploadResponse = await cloudinary.uploader.upload(profilePic);
            uploadedUrl = uploadResponse.secure_url;
        } catch (err) {
            console.log("Cloudinary upload error:", err);
            return res.status(400).json({ message: "Invalid profile picture" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadedUrl },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (err) {
        console.log("Error in updateProfile controller:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};