import express from "express";
import bodyParser from "body-parser";
import cors from 'cors'
import mongoose from "mongoose";
import dotenv from 'dotenv'
import helmet from 'helmet'
import multer from "multer";
import morgan from "morgan";
import path from 'path'
import { fileURLToPath } from "url";

import {register} from "./Controllers/Auth.js";
import authRoutes from "./Routes/auth.js"
import userRoutes from './Routes/users.js'
import postRoutes from './Routes/posts.js'
import {createPosts} from './Controllers/Posts.js'
import { verifyToken } from "./Middleware/auth.js";
import { getActiveUsers } from "./Controllers/users.js";

// CONFIGURATIONS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy())
app.use(morgan("common"))
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors())
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));
           
// FILE STORAGE 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage })

// ROUTERS FOR FILES
app.post("/auth/register",upload.single("picture"),register)
app.post("/posts",upload.single("picture"),verifyToken,createPosts)

// ROUTERS
app.use("/auth",authRoutes)
app.use("/users",userRoutes)
app.use('/posts',postRoutes)
app.use('/activeUsers',verifyToken,getActiveUsers);

app.get('/assets/:imageName',(req,res)=>{
    const {imageName} = req.params;
    const imagePath = path.join(__dirname,'public/assets/',imageName)
    res.sendFile(imagePath)
})

// MONGOOSE SETUP 
const PORT = process.env.PORT
mongoose.connect(process.env.MONGO_URL,{
    useUnifiedTopology:true,
    useNewURLParser: true 
})
.then(()=>{
    console.log("Connected")
})
.catch((e)=>{console.log(`${e} error occurred`)})

app.listen(PORT,()=>{
    console.log(`Server PORT : ${PORT}`)
})