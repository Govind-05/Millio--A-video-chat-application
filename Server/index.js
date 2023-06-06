import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import User from "./Database/Models/UserModel.js";
import * as dotenv from 'dotenv';
dotenv.config();
import authenticateToken from "./Middlewares/jwtAuth.js"

const app = express();
app.use(cors({ origin: true, credentials: true, exposedHeaders: ["set-cookie"] }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", 1);


mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URI);

const saltRounds = 10;

app.post("/registerUser", async (req, res) => {

    const password = await bcrypt.hash(req.body.password, saltRounds);
    const userData = new User({
        username: req.body.username,
        password: password
    });

    try {
        await userData.save();

        const user = { username: req.body.username }
        const accessToken = jwt.sign(user, process.env.TOKEN_SECRET);

        res.cookie("username", req.body.username, { sameSite: "none", secure}).cookie("accessToken", accessToken, { httpOnly: true, sameSite: "none", secure}).send({ msg: "Done", accessToken });
    } catch (error) {
        res.send({ msg: error.code });
    }

});

app.post("/loginUser", async (req, res) => {
    try {
        const response = await User.findOne({ username: req.body.username });
        if (response !== null) {
            const password = response.password;
            bcrypt.compare(req.body.password, password, (err, result) => {
                if (result) {
                    const user = { username: req.body.username }
                    const accessToken = jwt.sign(user, process.env.TOKEN_SECRET);

                    res.cookie("username", req.body.username, { sameSite: "none", secure}).cookie("accessToken", accessToken, { httpOnly: true, secure, sameSite: "none"}).send({ msg: "User logged in" })

                } else {
                    res.send({ msg: "error" })
                }
            })
        } else {
            res.send({ msg: "error" })
        }
    } catch (error) {
        res.send({ msg: "Server Error" });
    }
});

app.post("/checkUser", authenticateToken, (req, res) => {
    res.sendStatus(200);
});

app.post("/logoutUser", (req, res) => {
    res.clearCookie("accessToken").send({ msg: "Done" });
})
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});