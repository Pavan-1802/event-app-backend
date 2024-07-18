import jwt from "jsonwebtoken"
import User from "../models/userModel.js"

const JWT_SECRET = process.env.JWT_SECRET

export const authMiddleware = (req,res,next) => {
    const token = req.header("Authorization").replace('Bearer ','')
    if(!token) {
        return res.status(401).json({message:'No token, Authorization Denied'})
    }
    try { 
        const decoded = jwt.verify(token, JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        res.status(401).json({message: "Invalid Token"})
    }
}

export const organizerMiddleware = async (req,res,next) => {
    try {
        const user = await User.findById(req.user.id)
        if(user.role !== "Organizer") {
            return res.status(403).json({message: "Access denied: Requires you to be an Organizer"})
        }
        next()
    } catch(err) {
        res.status(500).json({message:err.message})
    }
}