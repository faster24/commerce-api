require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./db/connect');
const cors = require('cors');

app.use(
    cors({
        origin: "*",
    })
)


const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const productRouter = require('./routes/product');
const cartRouter = require('./routes/cart');
const orderRouter = require('./routes/order');
const stripeRouter = require('./routes/stripe');


app.get( '/' , (req , res ) =>{
    res.send("Index of API");
})


const port = process.env.PORT || 5000;

//db connect
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen( port , () => console.log(`Server is listening at ${port}`));
    } catch (error) {
        console.log(error.message);
    }
}

//middlewares
app.use(express.json());

//Routes

app.use( '/api/v1/auth' , authRouter ); 
app.use( '/api/v1/users' , userRouter ); 
app.use( '/api/v1/products' , productRouter ); 
app.use("/api/carts", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/checkout", stripeRouter);

start();