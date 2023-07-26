import express from 'express'
const app = express();
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import { register, login, getCurrentUser, getSellProducts, getCurrentUserWithPass, updateProfile, singleSellProduct } from './controllers/User.controllers.js';
import { addProduct, allProducts, updateProduct } from './controllers/Product.controllers.js';
import mongoose from 'mongoose';
import User from './modal/User.schema.js';
dotenv.config();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Working...")
})

app.post("/form", async (req, res) => {
    try {
        const { userData } = req.body;
        if (!userData) return res.send("UserData is required!")
        const { name, email, password } = userData;
        if (!name) return res.send("name is required!")
        if (!email) return res.send("email is required!")
        if (!password) return res.send("password is required!")

        const user = new User({
            name, email, password
        })
        await user.save();

        res.json({ status: "Success" })

    } catch (error) {
        res.send(error)
    }
})

// check user
app.post("/get-current-user", getCurrentUser)
app.post("/get-current-user-with-pass", getCurrentUserWithPass)

//user routes
app.post('/register', register)
app.post('/login', login)
app.post("/get-sell-products", getSellProducts)
app.post("/single-sell-product", singleSellProduct)
app.post("/update-profile", updateProfile)

//product routes
app.post('/add-product', addProduct)
app.get('/all-products', allProducts)
app.post('/update-product', updateProduct)

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Conncted to DB.")
}).catch((error) => {
    console.log("Error while DB connection:", error)
})

app.listen(8000, () => {
    console.log("Server is listening on port 8000.")
})