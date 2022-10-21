const express=require('express')
const auth=require('./routes/auth')
const posts=require('./routes/posts')

const app=express()
//this is for req.body not erroring
app.use(express.json())

//all route starts with "/auth"
app.use('/auth',auth)
app.use('/posts',posts)


app.get('/',(req,res)=>{
    res.send("Hi I am working")
})

app.listen(5000,()=>{
    console.log("app is listening to port 5000");
})