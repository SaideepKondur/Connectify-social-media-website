const express = require('express');
const dotenv = require('dotenv') ;
const dbConnect = require('./dbConnect');
const authRouter = require('./routers/authRouter');
const postsRouter = require('./routers/postsRouter');
const userRouter = require('./routers/userRouter');
const searchRouter = require('./routers/searchRouter');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
dotenv.config('./.env');

// Configuration
cloudinary.config({  
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// Increase image payload size limit to 10MB
// app.use(express.urlencoded({ limit: '10mb', extended: true }));  

//middlewares
app.use(express.json({ limit: '10mb' }));
app.use(morgan("common"));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: process.env.CORS_ORIGIN}));

console.log("CORS_ORIGIN:", process.env.CORS_ORIGIN);

//routers
app.use('/auth', authRouter);
app.use('/posts', postsRouter);
app.use('/user', userRouter);
app.use('/search', searchRouter);
app.get('/', (req, res) => {
    res.status(200).send("OK from Server");
});  

const PORT = process.env.PORT || 4001;

dbConnect();

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
