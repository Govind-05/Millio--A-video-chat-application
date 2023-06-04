import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import User from "./Database/Models/UserModel.js";

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1:27017/millioDB");

app.post("/registerUser",async(req,res)=>{

    const userData=new User({
        username:req.body.username,
        password:req.body.password
    });

    try {
        await userData.save();
        res.send({msg:"Done"});
    } catch (error) {
        res.send({msg:error.code});
    }

});

app.post("/loginUser",async(req,res)=>{
    try {
        const response=await User.findOne({username:req.body.username});
        if(response!==null){
            if(response.password===req.body.password){
                res.send({msg:"User logged in"})
            }else{
                res.send({msg:"error"})
            }
        }else{
            res.send({msg:"error"})
        }
    } catch (error) {
        res.send({msg:"Server Error"});
    }
});

const port=3000;
app.listen(port,()=>{
    console.log(`Server is listening on port ${port}`);
});