"use strict";
var jwt = require("jsonwebtoken");
const constants = require('../helpers/constants')
const token = process.env.token;

const Authentication=(req,res,next)=>{
    const key =req.headers.Authentication
    if(key){
        const decode = jwt.verify(key,token)//decodeing the token
        if (decode){
            const UserID =decode.UserID//we get tokenized user id 
            req.body.UserID= UserID // added to req body so i can acces it in any route
            next()
        }else{
            res.send({
                ...constants.message("please login first")
            })
        }
    }else{
        res.send({
            ...constants.message("please login first")
        })
        
    }
}
export default Authentication();