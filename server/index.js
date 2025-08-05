import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import "dotenv/config"
import { connectDb } from "./config/mongoose.js"
import authRoute from "./routes/authRouter.js"
import userRoute from "./routes/userRouter.js"

const app=express()
app.use(express.json())
const port=process.env.PORT||4500
connectDb()
app.use(cookieParser())
app.use(cors({origin:"https://mern-authentication-mk0z.onrender.com",credentials:true}))

app.use("/api/auth",authRoute)
app.use("/api/user",userRoute)

app.use("/",(req,res)=>{
    res.send("api is working")
}
)

app.listen(port,()=>console.log(`server started :${port}`))