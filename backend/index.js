const express=require('express');
const cors=require('cors');
require('dotenv').config();
const connect=require('./db');
const app = express();
app.use(cors());
const registerRouter=require('./routes/register.route')
app.use(express.json());
connect();
const port = process.env.PORT ||6000;

app.use('/api/v1',registerRouter)



app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})
