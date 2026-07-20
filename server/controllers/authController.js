import userModel from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
//Generate Token
const generateToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:"30d"
    });
}
//Register User
export const registerUser = async (req, res) => {
    
    try {
        const { name, email, password } = req.body;
        if(!name || !email || !password) {
            return res.status(400).json({ message: "Please fill all fields" });
        };
        //check user exissts
        let existingUser=await userModel.findOne({email});
        if(existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashPassword=await bcrypt.hash(password,10);
        const user = await userModel.create({
            name,email,password:hashPassword
        });
        const token=generateToken(user._id);
        return res.status(201).json({
            success:true,
            _id:user._id,
            name:user.name,
            email:user.email,
            token
        });

    }

    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }

}


//LOgin User
export const loginUser = async (req, res) => {
    
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({ message: "Please fill all fields" });
        };
        //check user exissts
        const user=await userModel.findOne({email});
        if(!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token=generateToken(user._id);
        return res.status(200).json({
            success:true,
            _id:user._id,
            name:user.name,
            email:user.email,
            token
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
}

export const getUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            }
        });
    } catch(error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
}
