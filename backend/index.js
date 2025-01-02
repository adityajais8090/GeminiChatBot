import express from 'express';
import cors from 'cors';
import router from './routes/routes.js';

const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ required : true })); 

app.use('/', router);


app.get('/' , (req,res)=>{
  res.send("hello World!");
});

app.listen(8000, ()=>{
 console.log("Server is running on port : 8000");
});

















