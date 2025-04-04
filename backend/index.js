const express=require('express');
const cors=require('cors');
require('dotenv').config();
const connect=require('./db');
const app = express();
app.use(cors());
app.use(express.json());
connect();
const port = process.env.PORT ||5000;

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})