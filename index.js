import express from "express"
import mongoose from "mongoose"
import authRoutes from "./routes/authRoutes.js"
import eventRoutes from "./routes/eventRoutes.js"
import dotenv from "dotenv"
import cors from "cors"

dotenv.config()

const app = express()
const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

app.use(cors())
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', eventRoutes);

mongoose.connect(MONGODB_URI).then(()=>{
    console.log("Successfully Connected to MongoDB")
    app.listen(PORT,()=>{
        console.log("Hello World")
    })
})

.catch((error)=> {
    console.log(error.message)
})