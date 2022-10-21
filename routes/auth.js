//all of routes for authenticating
const router=require('express').Router()
const {check,validationResult}=require('express-validator')
const {users}=require("../db")
const bcrypt=require("bcrypt")
const JWT=require("jsonwebtoken")



//for testing post requests we go to postman
router.post('/signup',[
    check("email","please enter a valid email").isEmail(),
    check("password","please enter a valid password").isLength({min:6}).isLowercase()
],async (req,res)=>{
    //users reqs will be saved in req.body
    const{email,password}=req.body
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    //VALIDATION IF USER EXISTS
    let user=users.find((user)=>{
        return user.email==email
    })
    if(user){
       return res.status(400).json({
            "errors": [
                {
                    "msg": "please enter a valid email",
                }
            ]
        })
    }


    

    const hashedPass=await bcrypt.hash(password,10)
    users.push({
        email,
        password :hashedPass
    })
   
    const token=await JWT.sign({
        email
    },"ksjdfjlj3l4534kj5jdlkfjlkj5klfgj",{
        expiresIn:360000
    })
    res.json({
        token
    })
})


//login route

router.post('/login',async (req,res)=>{
 const{email, password}=req.body
 let user=users.find(user=>{
    return user.email==email
 })
 if(!user){
    return res.status(400).json({
         "errors": [
             {
                 "msg": "Invalid Credentials",
             }
         ]
     })
 }

 //compare the enterd pass with the one in database
 let isMatch=await bcrypt.compare(password,user.password)
 if(!isMatch){
    return res.status(400).json({
         "errors": [
             {
                 "msg": "Invalid Credentials",
             }
         ]
     })
 }

 const token=await JWT.sign({
    email
},"ksjdfjlj3l4534kj5jdlkfjlkj5klfgj",{
    expiresIn:360000
})
res.json({
    token
})
})

//
router.get("/all",(req,res)=>{
    res.send(users)
})

module.exports=router