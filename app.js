require('dotenv').config();
require('express-async-errors')
const express = require('express');
const app = express();
const morgon = require('morgan')
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload')

const port  = process.env.PORT || 3000;
// imports
const connectDB = require('./db/connect');

const authRoutes  = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const orderRoutes = require('./routes/orderRoutes');

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// security package
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const mongoSantize = require('express-mongo-sanitize');

// middleware
app.use(express.json());
app.use(express.static('./public'))
app.use(cookieParser(process.env.JWT_SECRET))
app.use(fileUpload())
app.use(morgon('tiny'))

app.set('trust proxy',1);

app.use(
    rateLimiter({
        windowMs : 15*60*1000,
        max:60,
    })
)

app.use(helmet());
app.use(xss());
app.use(cors());
app.use(mongoSantize());



app.get('/api/v1',(req,res)=>{
    console.log(req.signedCookies)
    res.send('E-commerse Api')
})

app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/user',userRoutes);
app.use('/api/v1/products',productRoutes);
app.use('/api/v1/reviews',reviewRoutes);
app.use('/api/v1/orders',orderRoutes);


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware); // this middle ware is set as last one bcecause of express rules and this only hit if the routes get success.
const start= async ()=>{
    try{
        await connectDB(process.env.MONGO_URL);
        app.listen(port,
            console.log(`Server is listening at ${port}`)
        )
    }
    catch(err){
        console.log(err);
    }
}


start();