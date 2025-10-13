const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors')
const app = express();
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes')

//Database Connection and its function
const connectToDb = require('./db/db');
connectToDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/',(req,res) =>{
    res.send('Hello World')
});

app.use('/users', userRoutes);

module.exports= app;