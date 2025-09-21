import express from 'express';

const router = express.Router();
router.get("/signup",(req,res)=>{
    res.send("Signup Endppoint");
})

router.get("/login",(req,res)=>{
    res.send("Login Endppoint");
})

router.get("/logout",(req,res)=>{
    res.send("Logout Endppoint");
})

export default router;