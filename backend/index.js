const express=require('express');
const cors=require('cors');
require('dotenv').config();
const connect=require('./db');
const app = express();
app.use(cors());
const userRouter=require('./routes/register.route')
const pollRouter =require('./routes/poll.routes')

app.use(express.json()); 
connect();
const port = process.env.PORT ||6000;

app.use('/api/v1',userRouter)
app.use('/api/v2', pollRouter )


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})
