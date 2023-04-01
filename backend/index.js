const express=require('express')
const mongoose=require('mongoose')
const dotenv=require('dotenv');
const { json } = require('express');
const pinRoute=require('./routes/pins.js');
const users=require('./routes/users.js');
const app=express();
const cors=require('cors');

dotenv.config()

app.use(express.json())

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("MongoDB connected");
}).catch((err)=>console.log(err));

const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

app.use('/api/pins',pinRoute )
app.use('/api/users',users)

port = process.env.PORT||8800;
app.listen(port,()=>{
    console.log(`Backend server is running on ${port}`)
}) 
